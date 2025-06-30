 # Embed user query
    # query_embedding = embed_chunks([request.query])[0]

    # Retrieve top chunks
    # results = searcher.search(query_embedding, top_k=request.top_k)
    # if not results:
    #     raise HTTPException(status_code=404, detail="No matching documents found.")

    # Combine and clean all context
    # context = " ".join([clean_text(res.get("chunk_text", "")) for res in results])
    # context = context[:3000]  # Truncate if too long

    # Build a powerful prompt
    # prompt = (
    #     f"You are an expert assistant. Use the CONTEXT to fully answer the user question.\n"
    #     f"QUESTION: {request.query}\n"
    #     f"CONTEXT: {context}\n"
    #     f"ANSWER:"
    # )

    # try:
    #     response = llm_pipeline(prompt, max_new_tokens=512, do_sample=False)[0]["generated_text"]
    #     answer = response.split("ANSWER:")[-1].strip()
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")
