from typing import List, Dict
from transformers import pipeline

# Initialize the summarization pipeline (load model ONCE!)
summarizer = pipeline("text2text-generation", model="facebook/bart-large-cnn")

def summarize_results(query: str, results: List[Dict]) -> str:
    """Perform extract + refine-style summarization for given results."""
    combined_text = " ".join([res.get("chunk_text", "") for res in results if res.get("chunk_text")])

    if not combined_text.strip():
        return "No relevant information found."

    # Truncate long text if needed
    MAX_INPUT_LENGTH = 1024  # bart-large-cnn has a context limit
    if len(combined_text) > MAX_INPUT_LENGTH:
        combined_text = combined_text[:MAX_INPUT_LENGTH]

    prompt = (
        f"The user asked: \"{query}\"\n\n"
        "Here are relevant snippets from documents:\n"
        f"{combined_text}\n\n"
        "Please provide a clear, concise, and accurate answer to the user's question. "
        "Mention which documents contain this information."
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
