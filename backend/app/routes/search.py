from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.faiss_search import DocumentSearcher
from app.utils.embedding_utils import embed_chunks
from app.utils.llm import llm_pipeline
from app.utils.summarizer import summarize_results
import re

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    top_k: int = 10 # Increase top_k for more context

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

@router.post("/search")
def search_docs(request: QueryRequest):
    try:
        searcher = DocumentSearcher()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Index/metadata error: {str(e)}")

    query_embedding = embed_chunks([request.query])[0]
    results = searcher.search(query_embedding, top_k=request.top_k)

    if not results:
        raise HTTPException(status_code=404, detail="No matching documents found.")

    answer = summarize_results(request.query, results)

    return {
        "query": request.query,
        "answer": answer,
        "source_files": list({r.get("filename", "unknown") for r in results})
    }
