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

    # Check if meeting exists
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Create upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Save uploaded file
    file_ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(settings.UPLOAD_DIR, f"{meeting_id}{file_ext}")

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Run transcription
    transcript_text = transcription_service.transcribe_audio_file(file_path)

    if transcript_text is None:
        raise HTTPException(status_code=500, detail="Transcription failed")

    # Save transcript in database
    meeting.transcript = transcript_text
    db.commit()
    db.refresh(meeting)

    return {
        "status": "success",
        "meeting_id": meeting_id,
        "transcript": transcript_text
    }