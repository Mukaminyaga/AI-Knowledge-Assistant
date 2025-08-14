# updated_search_router_debug.py

import os
import re
import requests
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.models.users import User
from app.database import get_db
# from app.llm import call_llm  # <-- Uncomment if you have an LLM reflow function

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    top_k: int = 10
    summarize: bool = False

# --- RunPod settings via env vars ---
RUNPOD_POD_PUBLIC_IP = os.environ.get("RUNPOD_POD_PUBLIC_IP")
POD_INTERNAL_PORT = int(os.environ.get("POD_INTERNAL_PORT", 8888))
POD_SHARED_SECRET = os.environ.get("POD_SHARED_SECRET")
RUNPOD_WORKER_URL = os.environ.get(
    "RUNPOD_WORKER_URL",
    "https://sqan4d7a8194h5-8000.proxy.runpod.net"
)

def clean_text(text: str) -> str:
    """Remove extra spaces and tidy text."""
    return re.sub(r'\s+', ' ', text).strip()

@router.post("/search")
@router.post("/search/")
def search_docs(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("[DEBUG] Starting search_docs")
    print(f"[DEBUG] Request: query={request.query}, top_k={request.top_k}, summarize={request.summarize}, tenant_id={current_user.tenant_id}")

    if not RUNPOD_POD_PUBLIC_IP:
        raise HTTPException(status_code=500, detail="RUNPOD_POD_PUBLIC_IP must be set in env")

    worker_url = f"{RUNPOD_WORKER_URL}/search"
    print(f"[DEBUG] Worker URL: {worker_url}")

    payload = {
        "query": request.query,
        "top_k": request.top_k,
        "summarize": bool(request.summarize),
        "tenant_id": current_user.tenant_id
    }
    print(f"[DEBUG] Payload: {payload}")

    headers = {}
    if POD_SHARED_SECRET:
        headers["Authorization"] = f"Bearer {POD_SHARED_SECRET}"
    print(f"[DEBUG] Headers: {headers}")

    try:
        resp = requests.post(worker_url, json=payload, headers=headers, timeout=60 + (request.top_k * 2))
        print(f"[DEBUG] Response status code: {resp.status_code}")
        print(f"[DEBUG] Raw response text: {resp.text}")
    except Exception as e:
        print(f"[DEBUG] Exception while calling worker: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to call worker in pod: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Worker error: {resp.status_code} {resp.text}")

    try:
        result = resp.json()
        print(f"[DEBUG] Parsed result JSON: {result}")
    except Exception as e:
        print(f"[DEBUG] Failed to parse JSON: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse worker response: {e}")

    # Filter by tenant
    results = [
        r for r in result.get("results", [])
        if str(r.get("tenant_id")) == str(current_user.tenant_id)
    ]
    print(f"[DEBUG] Filtered results count: {len(results)}")

    if not results:
        raise HTTPException(status_code=404, detail="No matching documents found for your tenant.")

    # --- Build answer ---
    sorted_chunks = sorted(results, key=lambda x: x.get("chunk_index", 0))
    combined_text = clean_text(" ".join(clean_text(chunk.get("chunk_text", "")) for chunk in sorted_chunks))

    if request.summarize:
        if result.get("summary"):
            final_answer = result["summary"]
        else:
            # Optional: Reflow with LLM for coherence without dropping facts
            prompt = (
                "Combine the following text into a single, coherent, complete answer "
                "without removing any factual content. Do not summarize or shorten.\n\n"
                f"{combined_text}"
            )
            # final_answer = call_llm(prompt)  # Uncomment if you have an LLM call
            final_answer = combined_text  # Fallback if no LLM
    else:
        final_answer = combined_text

    return {
        "query": request.query,
        "answer": final_answer,
        "raw_results": results,
        "source_files": list({r.get("filename", "unknown") for r in results})
    }
