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
    summarize: bool = True
    # optional chat history for follow-ups (most-recent last)
    history: list[str] = []

# --- RunPod settings ---
POD_INTERNAL_PORT = int(os.environ.get("POD_INTERNAL_PORT", 8888))
POD_SHARED_SECRET = os.environ.get("POD_SHARED_SECRET")
RUNPOD_WORKER_URL = os.environ.get("RUNPOD_WORKER_URL")

def clean_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text or "").strip()

@router.post("/search")
@router.post("/search/")
def search_docs(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    worker_url = f"{RUNPOD_WORKER_URL}/search"
    payload = {
        "query": request.query,
        "top_k": request.top_k,
        "summarize": request.summarize,
        "tenant_id": current_user.tenant_id,
        "history": request.history,  # pass along for follow-ups
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

    # Safety: enforce tenant_id
    results = [
        r for r in result.get("results", [])
        if str(r.get("tenant_id")) == str(current_user.tenant_id)
    ]

    if not results and not result.get("summary"):
        raise HTTPException(status_code=404, detail="No matching documents found for your tenant.")

    # The worker now returns a single winning source_file and answer from that source only
    final_answer = result.get("summary") or ""
    source_file = result.get("source_file") or (results[0].get("filename") if results else "unknown")

    return {
        "query": request.query,
        "answer": clean_text(final_answer),
        "raw_results": results,            # chunks, but ONLY from the chosen source file
        "source_files": [source_file],     # single file only
    }
