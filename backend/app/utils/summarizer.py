from typing import List, Dict
from transformers import pipeline

# Initialize the summarization pipeline (load model ONCE!)
summarizer = pipeline("text2text-generation", model="google/flan-t5-base")

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
    """Perform extract + refine-style summarization for given results."""
    combined_text = " ".join([res.get("chunk_text", "") for res in results if res.get("chunk_text")])

    if not combined_text.strip():
        return "No relevant information found."
    
    combined_text = remove_redundant_lines(combined_text)
    # Truncate long text if needed
    MAX_INPUT_LENGTH = 1024  # bart-large-cnn has a context limit
    if len(combined_text) > MAX_INPUT_LENGTH:
        combined_text = combined_text[:MAX_INPUT_LENGTH]

    prompt = (
    f"The user asked: \"{query}\"\n\n"
    "These are excerpts from documents:\n"
    f"{combined_text}\n\n"
    "Give a complete, clear, and helpful answer. "
    "Return the list or explanation clearly without repeating or cutting off mid-sentence."
)
    try:
        summary_output = summarizer(prompt, max_length=250, do_sample=False)
        if not summary_output or "generated_text" not in summary_output[0]:
            return "Summary generation failed: No output returned."
        return summary_output[0]["generated_text"].strip()
    except Exception as e:
        return (
            "An error occurred while generating the summary. Here are relevant snippets:\n" + combined_text
        )

