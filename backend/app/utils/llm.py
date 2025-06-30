from transformers import pipeline

llm_pipeline = pipeline(
    "text2text-generation",
    model="google/flan-t5-base",
    device=-1
)