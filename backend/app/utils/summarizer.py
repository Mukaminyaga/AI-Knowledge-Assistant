from typing import List, Dict
import re
from transformers import pipeline

# Load model once
summarizer = pipeline("text2text-generation", model="google/flan-t5-large", device=-1)


def remove_redundant_lines(text: str) -> str:
    seen = set()
    lines = text.strip().splitlines()
    result = []
    for line in lines:
        line = line.strip()
        if line and line not in seen:
            seen.add(line)
            result.append(line)
    return "\n".join(result)


def score_chunk_relevance(chunk: str, query: str) -> int:
    """Heuristic to give higher priority to chunks that contain step-like or keyword matches."""
    score = 0
    if re.search(r"\b\d+\.", chunk):  # looks like a step/list
        score += 1
    if re.search(r"\bdesign process\b", chunk, re.IGNORECASE):
        score += 1
    if query.lower() in chunk.lower():
        score += 2
    return score


def summarize_results(query: str, results: List[Dict]) -> str:
    """Adaptive hybrid summarizer: wide coverage, but smart ranking."""
    all_chunks = [res.get("chunk_text", "") for res in results if res.get("chunk_text")]

    if not all_chunks:
        return "No relevant content found."

    # Rank and sort chunks
    scored = [(chunk, score_chunk_relevance(chunk, query)) for chunk in all_chunks]
    scored.sort(key=lambda x: x[1], reverse=True)

    # Top N (say, top 7 chunks max) — allow for diversity but still trim noise
    selected_chunks = [chunk for chunk, _ in scored[:7]]

    combined_text = "\n".join(selected_chunks)
    combined_text = remove_redundant_lines(combined_text)

    prompt = (
        f"You are a helpful assistant.\n\n"
        f"The user asked: \"{query}\"\n\n"
        "Here are relevant excerpts from technical documents:\n"
        f"{combined_text}\n\n"
        "Provide a clear and complete answer using only the information above. "
        "Use lists if appropriate, and do not invent facts. Focus on clarity and structure."
    )

    try:
        summary_output = summarizer(prompt, max_new_tokens=300, do_sample=False)
        return summary_output[0]["generated_text"].strip()
    except Exception as e:
        print("Summarization failed:", e)
        return f"Here is the raw content instead:\n\n{combined_text}"
