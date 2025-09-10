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
    history: list[str] = []

POD_SHARED_SECRET = os.environ.get("POD_SHARED_SECRET", "")
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
    if not RUNPOD_WORKER_URL:
        raise HTTPException(status_code=500, detail="RUNPOD_WORKER_URL not configured")

    worker_url = f"{RUNPOD_WORKER_URL.rstrip('/')}/search"
    payload = {
        "query": request.query,
        "top_k": request.top_k,
        "summarize": request.summarize,
        "tenant_id": int(current_user.tenant_id),
        "history": request.history,
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

    # enforce tenant_id
    results = [
        r for r in result.get("results", [])
        if str(r.get("tenant_id")) == str(current_user.tenant_id)
    ]

    if not results and not result.get("summary"):
        raise HTTPException(status_code=404, detail="No matching documents found for your tenant.")

    final_answer = result.get("summary") or ""
    # collect unique source files from hits
    source_files = list({r.get("filename") for r in results}) if results else []

    return {
    "query": request.query,
    "answer": final_answer,  # don’t clean/flatten here
    "raw_results": results,
    "source_files": source_files,
}
