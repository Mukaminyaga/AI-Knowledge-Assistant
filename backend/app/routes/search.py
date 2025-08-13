# updated_search_router.py  (paste into your existing router file, replacing the old search_docs function)
import os
import time
import requests
import re
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.models.users import User
from app.database import get_db

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    top_k: int = 10
    summarize: bool = False

# --- RunPod settings via env vars ---
RUNPOD_API_KEY = os.environ.get("RUNPOD_API_KEY")  # set this locally (do NOT hardcode)
RUNPOD_POD_ID = os.environ.get("RUNPOD_POD_ID")  
RUNPOD_BASE = os.environ.get("RUNPOD_API_BASE", "https://rest.runpod.io/v1")
POLL_TIMEOUT = int(os.environ.get("RUNPOD_START_TIMEOUT", 120))  # seconds to wait for pod to boot
POLL_INTERVAL = float(os.environ.get("RUNPOD_POLL_INTERVAL", 2.0))
POD_INTERNAL_PORT = int(os.environ.get("POD_INTERNAL_PORT", 8000))  # port worker listens on in the pod
POD_SHARED_SECRET = os.environ.get("POD_SHARED_SECRET") 

def _start_pod(pod_id: str):
    url = f"{RUNPOD_BASE}/pods/{pod_id}/start"
    headers = {"Authorization": f"Bearer {RUNPOD_API_KEY}"}
    r = requests.post(url, headers=headers, timeout=30)
    if r.status_code not in (200, 202):
        raise RuntimeError(f"Failed to start pod: {r.status_code} {r.text}")
    return r.json()

def _get_pod_info(pod_id: str):
    url = f"{RUNPOD_BASE}/pods/{pod_id}"
    headers = {"Authorization": f"Bearer {RUNPOD_API_KEY}"}
    r = requests.get(url, headers=headers, timeout=30)
    if r.status_code != 200:
        raise RuntimeError(f"Failed to get pod info: {r.status_code} {r.text}")
    return r.json()

def _stop_pod(pod_id: str):
    url = f"{RUNPOD_BASE}/pods/{pod_id}/stop"
    headers = {"Authorization": f"Bearer {RUNPOD_API_KEY}"}
    r = requests.post(url, headers=headers, timeout=30)
    # Accept 200 or 202 as success
    if r.status_code not in (200, 202):
        raise RuntimeError(f"Failed to stop pod: {r.status_code} {r.text}")
    return r.json()

def _find_external_port(pod_info: dict, internal_port: int):
    """
    pod_info should contain a 'portMappings' dict like {"22": 10341}
    Look up internal_port as str and return external port (int).
    """
    pm = pod_info.get("portMappings") or {}
    # keys might be strings; compare as str
    ext = pm.get(str(internal_port))
    if ext:
        return int(ext)
    # fallback: if there's a 'ports' listing and only one port exposed, try to use that
    ports = pod_info.get("ports") or []
    if len(ports) == 1:
        # format can be "8000/http" - try to parse it
        p = ports[0].split("/")[0]
        try:
            return int(p)
        except:
            pass
    return None

@router.post("/search")
@router.post("/search/")
def search_docs(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not RUNPOD_API_KEY or not RUNPOD_POD_ID:
        raise HTTPException(status_code=500, detail="RUNPOD_API_KEY and RUNPOD_POD_ID must be set in env")

    # 1) start pod
    try:
        _start_pod(RUNPOD_POD_ID)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start pod: {e}")

    # 2) wait for pod to be running and get public IP + external port
    start_at = time.time()
    pod_info = None
    public_ip = None
    external_port = None
    while time.time() - start_at < POLL_TIMEOUT:
        try:
            pod_info = _get_pod_info(RUNPOD_POD_ID)
        except Exception as e:
            # keep polling
            pod_info = None

        if pod_info:
            # pod_info typically contains 'publicIp' and 'portMappings'
            public_ip = pod_info.get("publicIp")
            external_port = _find_external_port(pod_info, POD_INTERNAL_PORT)
            state = pod_info.get("state") or pod_info.get("status") or pod_info.get("podState") or pod_info.get("phase")
            # consider RUNNING when we have public_ip and external_port
            if public_ip and external_port:
                break

        time.sleep(POLL_INTERVAL)

    if not public_ip or not external_port:
        # try to stop pod before returning error
        try:
            _stop_pod(RUNPOD_POD_ID)
        except Exception:
            pass
        raise HTTPException(status_code=504, detail="Pod did not become reachable in time")

    # 3) call the worker inside the pod
    worker_url = f"http://{public_ip}:{external_port}/search"
    payload = {"query": request.query, "top_k": request.top_k, "summarize": bool(request.summarize), "tenant_id": current_user.tenant_id}
    headers = {}
    if POD_SHARED_SECRET:
        headers["Authorization"] = f"Bearer {POD_SHARED_SECRET}"

    try:
        resp = requests.post(worker_url, json=payload, headers=headers, timeout=60 + (request.top_k * 2))
    except Exception as e:
        # try to stop pod, then raise
        try:
            _stop_pod(RUNPOD_POD_ID)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"Failed to call worker in pod: {e}")

    # Always try to stop the pod after the job is done (best-effort)
    try:
        _stop_pod(RUNPOD_POD_ID)
    except Exception as e:
        # don't fail the user if stop failed; just log
        print("Warning: failed to stop pod:", e)

    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Worker error: {resp.status_code} {resp.text}")

    result = resp.json()

    # filter results by tenant just to be safe (worker already attempted this).
    results = []
    for r in result.get("results", []):
        if str(r.get("tenant_id")) == str(current_user.tenant_id):
            results.append(r)

    if not results:
        raise HTTPException(status_code=404, detail="No matching documents found for your tenant.")

    # Summarizer result available in result.get('summary')
    return {
        "query": request.query,
        "answer": result.get("summary") or "",   # summary if available
        "raw_results": results,
        "source_files": list({r.get("filename","unknown") for r in results})
    }
