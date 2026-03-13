from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import schemas, models
from app.database.database import get_db
from app.services.insight_service import insight_service
from app.ai.vector_store import vector_store

router = APIRouter()

@router.post("/generate/{meeting_id}")
def generate_insights(
    meeting_id: str, 
    request: schemas.InsightsGenerateRequest, 
    db: Session = Depends(get_db)
):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    insights = insight_service.generate_all_insights(request.transcript)
    
    # Optional: Save insights to DB here
    # meeting.summary = insights.get("summary")
    # ... logic for task saving
    # db.commit()
    
    # Store transcript in FAISS for chatbot
    vector_store.add_documents([request.transcript])

    return insights

@router.post("/integrate/{meeting_id}")
def integrate_notes(
    meeting_id: str, 
    request: schemas.IntegrateNotesRequest, 
    db: Session = Depends(get_db)
):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    enhanced_data = insight_service.integrate_transcript_with_notes(
        request.transcript, 
        request.user_notes
    )
    
    return enhanced_data
