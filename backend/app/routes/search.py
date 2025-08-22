# updated_search_router_hybrid.py

import os
import re
import requests
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
    summarize: bool = True   # default True since hybrid expects an answer

# --- RunPod settings ---
POD_INTERNAL_PORT = int(os.environ.get("POD_INTERNAL_PORT", 8888))
POD_SHARED_SECRET = os.environ.get("POD_SHARED_SECRET")
RUNPOD_WORKER_URL = os.environ.get("RUNPOD_WORKER_URL")
# RUNPOD_WORKER_URL = os.environ.get(
#     "RUNPOD_WORKER_URL",
#     "https://o211rs01tttfhp-8000.proxy.runpod.net"
# )

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
    print(f"[DEBUG] QueryRequest: {request.dict()}, tenant_id={current_user.tenant_id}")


    worker_url = f"{RUNPOD_WORKER_URL}/search"
    payload = {
        "query": request.query,
        "top_k": request.top_k,
        "summarize": request.summarize,
        "tenant_id": current_user.tenant_id
    }
    headers = {}
    if POD_SHARED_SECRET:
        headers["Authorization"] = f"Bearer {POD_SHARED_SECRET}"

    try:
        resp = requests.post(worker_url, json=payload, headers=headers, timeout=60 + (request.top_k * 2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to call worker: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Worker error: {resp.status_code} {resp.text}")

    try:
        result = resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse worker response: {e}")

    # Filter results for this tenant (safety check — though worker should already do this)
    results = [
        r for r in result.get("results", [])
        if str(r.get("tenant_id")) == str(current_user.tenant_id)
    ]

    if not results:
        raise HTTPException(status_code=404, detail="No matching documents found for your tenant.")

    # --- Hybrid Response ---
    final_answer = result.get("summary")
    if not final_answer:
        # fallback: merge chunks
        sorted_chunks = sorted(results, key=lambda x: x.get("chunk_index", 0))
        combined_text = clean_text(" ".join(clean_text(c.get("chunk_text", "")) for c in sorted_chunks))
        final_answer = combined_text

    return {
        "query": request.query,
        "answer": final_answer,           # main grounded answer (from worker LLM)
        "raw_results": results,           # top retrieved chunks
        "source_files": list({r.get("filename", "unknown") for r in results})
    }
