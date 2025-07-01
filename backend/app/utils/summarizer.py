from typing import List, Dict
from transformers import pipeline

# Initialize the summarization pipeline (load model ONCE!)
summarizer = pipeline("text2text-generation", model="google/flan-t5-large", device=-1)


def remove_redundant_lines(text: str) -> str:
    seen = set()
    lines = text.strip().splitlines()
    result = []
    for line in lines:
        if line not in seen:
            seen.add(line)
            result.append(line)
    return "\n".join(result)

def summarize_results(query: str, results: List[Dict]) -> str:
    """Builds a complete answer from results using better chunk merging."""
    combined_text = "\n".join([res.get("chunk_text", "") for res in results if res.get("chunk_text")])
    combined_text = remove_redundant_lines(combined_text)

    # Don't truncate to 1024 chars — allow full passage
    prompt = (
        f"The user asked: \"{query}\"\n\n"
        "These are relevant document excerpts:\n"
        f"{combined_text}\n\n"
        "Give a complete and detailed answer based on the information above. "
        "Ensure lists are not cut and that the response includes all items mentioned."
    )

    try:
        summary_output = summarizer(prompt, max_length=512, do_sample=False)
        return summary_output[0]["generated_text"].strip()
    except Exception:
        return f"Here is the raw result:\n\n{combined_text}"
