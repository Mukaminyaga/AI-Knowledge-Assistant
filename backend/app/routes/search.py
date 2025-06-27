from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.database import DocumentSearcher
from app.utils.embedding_utils import embed_chunks
from app.utils.llm import llm_pipeline
import re

router = APIRouter()


class QueryRequest(BaseModel):
    query: str
    top_k: int = 3


def deduplicate_lines(text: str) -> str:
    """Remove duplicate lines from the context to reduce verbosity."""
    lines = text.split('\n')
    seen = set()
    unique_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped and stripped not in seen:
            unique_lines.append(line)
            seen.add(stripped)
    return '\n'.join(unique_lines)


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

    # ✅ Build and CLEAN the context
    context = '\n'.join([res.get("chunk_text", "") for res in results])
    context = deduplicate_lines(context)

    # Optional: Truncate context if too long
    MAX_CONTEXT_LENGTH = 3000  # Adjust as needed
    context = context[:MAX_CONTEXT_LENGTH]

    prompt = (
        "You are an expert assistant. Answer the user query based strictly on the CONTEXT. "
        "Give a concise, direct, authoritative answer. Do NOT repeat definitions or lines. "
        "If the CONTEXT does not contain enough information, reply with \"I don't know.\"\n\n"
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
