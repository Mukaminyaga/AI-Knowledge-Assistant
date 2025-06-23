from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.database import DocumentSearcher
from app.utils.embedding_utils import embed_chunks
from app.utils.llm import llm_pipeline

router = APIRouter()


class QueryRequest(BaseModel):
    query: str
    top_k: int = 3


@router.post("/search")
def search_docs(request: QueryRequest):
    """Perform RAG-style search: embed query, retrieve top results, and use LLM to answer."""
    try:
        searcher = DocumentSearcher()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Index or metadata file error: {str(e)}")

    # ✅ Embed the user query
    query_embedding = embed_chunks([request.query])[0]

    # ✅ Perform the search
    results = searcher.search(query_embedding, top_k=request.top_k)

    if not results:
        raise HTTPException(status_code=404, detail="No matching documents found.")

    # ✅ Build the context for LLM
    context = '\n'.join([res.get("chunk_text", "") for res in results])
    prompt = (
        "You are an expert assistant. Answer the user query based on the CONTEXT. "
        "Be concise, direct, and authoritative. If the CONTEXT does not contain enough information, say you don't know.\n\n"
        f"QUERY: {request.query}\nCONTEXT:\n{context}\nANSWER:"
    )
    generation = llm_pipeline(prompt, max_new_tokens=250, do_sample=False)[0]["generated_text"]

    # ✅ Extract the answer
    answer = generation.split("ANSWER:")[-1].strip()

    # ✅ Extract source files
    source_files = list({res.get("filename", "unknown") for res in results})
    return {
        "query": request.query,
        "answer": answer,
        "source_files": source_files
    }
