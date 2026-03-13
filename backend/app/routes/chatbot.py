from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import models
from app.database.database import get_db
from app.ai.llm_client import llm_client
from app.ai.vector_store import vector_store
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/{meeting_id}")
def chat_with_meeting(
    meeting_id: str, 
    request: ChatRequest, 
    db: Session = Depends(get_db)
):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Retrieve specific meeting chunks using FAISS. 
    # In a real multi-tenant app, FAISS needs namespace/metadata filtering by meeting_id.
    # For now, we search the global index since we just stored it there during generation.
    relevant_chunks = vector_store.search(request.query, k=3)
    
    # If no vector results, fallback to full transcript (if small enough)
    context_str = "\n".join(relevant_chunks) if relevant_chunks else meeting.transcript

    if not context_str:
        return {"role": "assistant", "text": "I don't have enough meeting context to answer that yet."}

    logger.info(f"Chatbot querying with context length: {len(context_str)}")
    
    answer = llm_client.chat(context=context_str, query=request.query)
    
    return {
        "role": "assistant",
        "text": answer
    }
