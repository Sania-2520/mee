from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import schemas, models
from app.database.database import get_db
from app.services.insight_service import insight_service
from app.ai.llm_client import llm_client

router = APIRouter()

@router.post("/generate/{meeting_id}")
def generate_timeline(
    meeting_id: str, 
    request: schemas.TimelineGenerateRequest, 
    db: Session = Depends(get_db)
):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Call AI Extraction
    events = llm_client.extract_timeline(request.transcript)
    
    # Save to db
    saved_events = []
    for evt in events:
        db_event = models.TimelineEvent(
            meeting_id=meeting.id,
            timestamp=evt.get("timestamp", "00:00"),
            event_type=evt.get("type", "topic_start"),
            description=evt.get("description", "")
        )
        db.add(db_event)
        saved_events.append(db_event)
        
    db.commit()
    
    # Refresh to return
    for e in saved_events:
        db.refresh(e)
        
    return {"status": "success", "events": saved_events}
