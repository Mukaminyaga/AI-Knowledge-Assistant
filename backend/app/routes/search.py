from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import re

from app.utils.faiss_search import DocumentSearcher
from app.utils.embedding_utils import embed_chunks
from app.utils.llm import llm_pipeline
from app.utils.summarizer import summarize_results
from app.auth import get_current_user
from app.models.users import User
from app.database import get_db


router = APIRouter()

print("✅ search.py loaded")

class QueryRequest(BaseModel):
    query: str
    top_k: int = 10

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

@router.post("/search")
@router.post("/search/")
def search_docs(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("✅ search_docs endpoint triggered")

    try:
        searcher = DocumentSearcher()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Index or metadata not found: {str(e)}")

    query_embedding = embed_chunks([request.query])[0]
    print("🔍 query embedding:", query_embedding)

    results = searcher.search(query_embedding, top_k=request.top_k, tenant_id=current_user.tenant_id)
    print("📄 Search results:", results)

    if not results:
        raise HTTPException(status_code=404, detail="No matching documents found for your tenant.")

    answer = summarize_results(request.query, results)

    return {
        "query": request.query,
        "answer": answer,
        "source_files": list({r.get("filename", "unknown") for r in results})
    }
