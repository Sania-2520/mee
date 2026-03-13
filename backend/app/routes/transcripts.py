import os
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database import models
from app.services.transcription_service import transcription_service
from app.config.settings import settings

router = APIRouter()

@router.post("/audio/{meeting_id}")
async def upload_audio_and_transcribe(
    meeting_id: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    file_ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(settings.UPLOAD_DIR, f"{meeting_id}{file_ext}")
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Transcribe
    transcript_text = transcription_service.transcribe_audio_file(file_path)
    if not transcript_text:
        raise HTTPException(status_code=500, detail="Transcription failed")

    # Update meeting transcript
    meeting.transcript = transcript_text
    db.commit()

    return {"status": "success", "transcript": transcript_text}
