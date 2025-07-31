from fastapi import APIRouter, HTTPException, Depends, Path
from pydantic import BaseModel
from sqlalchemy.orm import Session
import re
from datetime import datetime
from app.utils.faiss_search import DocumentSearcher
from app.utils.embedding_utils import embed_chunks
from app.utils.summarizer import summarize_results
from app.auth import get_current_user
from app.models.users import User
from app.models.chat import ChatSession, ChatMessage
from app.database import get_db

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    top_k: int = 10

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

@router.post("/search")
def search_docs(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = clean_text(request.query).lower()
    greeting_keywords = {"hello", "h", "hi", "hey", "goodmorning", "good morning"}

    # Check for greetings
    if query in greeting_keywords:
        greeting_response = "Hello! I'm your Knowledge Assistant AI. How can I help you today?"

        # Create a new chat session for greeting
        session = ChatSession(
            user_id=current_user.id,
            tenant_id=current_user.tenant_id,
            title="Greeting",
            created_at=datetime.utcnow(),
            bookmarked=False
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # User message
        user_msg = ChatMessage(
            session_id=session.id,
            user_id=current_user.id,
            tenant_id=current_user.tenant_id,
            role="user",
            text=request.query,
            created_at=datetime.utcnow()
)
        db.add(user_msg)

# Assistant response
        assistant_msg = ChatMessage(
              session_id=session.id,
              user_id=current_user.id,
              tenant_id=current_user.tenant_id,
              role="assistant",
              text=greeting_response,
              results=[],  # or keep as is
              created_at=datetime.utcnow()
)
        db.add(assistant_msg)

        db.commit()


        return {
            "query": request.query,
            "answer": greeting_response,
            "source_files": [],
            "session_id": session.id
        }

    # Perform semantic search
    try:
        searcher = DocumentSearcher()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Index or metadata not found: {str(e)}")

    query_embedding = embed_chunks([request.query])[0]
    results = searcher.search(query_embedding, top_k=request.top_k, tenant_id=current_user.tenant_id)

    if results:
        answer = summarize_results(request.query, results)
        source_files = list({r.get("filename", "unknown") for r in results})
    else:
        answer = "Sorry, I couldn’t find any relevant documents for your query."
        source_files = []

    # ✅ Try to find the latest existing session for this user
    session = (
        db.query(ChatSession)
        .filter_by(user_id=current_user.id, tenant_id=current_user.tenant_id)
        .order_by(ChatSession.created_at.desc())
        .first()
    )

    # If no session exists, create a new one with the query title
    if not session:
        session = ChatSession(
            user_id=current_user.id,
            tenant_id=current_user.tenant_id,
            title=request.query[:30],
            created_at=datetime.utcnow(),
            bookmarked=False
        )
        db.add(session)
        db.commit()
        db.refresh(session)

    # Store chat message under the same session
        user_msg = ChatMessage(
            session_id=session.id,
            user_id=current_user.id,
            tenant_id=current_user.tenant_id,
            role="user",
            text=request.query,
            created_at=datetime.utcnow()
)
        db.add(user_msg)

# Assistant response
        assistant_msg = ChatMessage(
              session_id=session.id,
              user_id=current_user.id,
              tenant_id=current_user.tenant_id,
              role="assistant",
              text=greeting_response,
              results=[],  # or keep as is
              created_at=datetime.utcnow()
)
        db.add(assistant_msg)

        db.commit()

    return {
        "query": request.query,
        "answer": answer,
        "source_files": source_files,
        "session_id": session.id
    }


class MessageRequest(BaseModel):
    query: str
    top_k: int = 10

@router.post("/chat/session/{session_id}/message")
def post_message_to_session(
    session_id: str = Path(..., description="ID of the chat session"),
    request: MessageRequest = ...,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = request.query.strip()

    # Ensure the session exists and belongs to the user
    session = (
        db.query(ChatSession)
        .filter_by(id=session_id, user_id=current_user.id, tenant_id=current_user.tenant_id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    # Perform semantic search
    try:
        searcher = DocumentSearcher()
        query_embedding = embed_chunks([query])[0]
        results = searcher.search(query_embedding, top_k=request.top_k, tenant_id=current_user.tenant_id)
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Search index error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    # Summarize results
    if results:
        answer = summarize_results(query, results)
        source_files = list({r.get("filename", "unknown") for r in results})
    else:
        answer = "Sorry, I couldn’t find any relevant documents for your query."
        source_files = []

    # Save message to DB
    chat_msg = ChatMessage(
        session_id=session_id,
        user_id=current_user.id,
        tenant_id=current_user.tenant_id,
        text=query,
        response=answer,
        results=results if results else [],
        created_at=datetime.utcnow()
    )
    db.add(chat_msg)
    db.commit()

    return {
        "query": query,
        "answer": answer,
        "source_files": source_files,
        "session_id": session_id
    }