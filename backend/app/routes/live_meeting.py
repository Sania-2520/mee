import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.database import models
from app.database.database import get_db
from app.utils.websocket_manager import manager
from app.services.transcription_service import transcription_service
import tempfile
import os

logger = logging.getLogger(__name__)
router = APIRouter()

@router.websocket("/ws/{meeting_id}")
async def websocket_endpoint(websocket: WebSocket, meeting_id: str, db: Session = Depends(get_db)):
    # Validate meeting exists
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        await websocket.close(code=4004, reason="Meeting not found")
        return

    await manager.connect(websocket, meeting_id)
    
    try:
        while True:
            # Receive audio chunk (bytes) from client
            audio_bytes = await websocket.receive_bytes()
            
            # In a real system, you would accumulate chunks or stream to a faster STT API.
            # Here we save to a temporary file for Whisper to process locally.
            with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name

            try:
                # Transcribe
                text = transcription_service.transcribe_audio_file(tmp_path)
                
                if text and text.strip():
                    # Save to DB (append to existing transcript)
                    existing_transcript = meeting.transcript or ""
                    meeting.transcript = f"{existing_transcript}\n{text}".strip()
                    db.commit()

                    # Broadcast new transcript segment to all clients
                    payload = json.dumps({
                        "type": "transcript_update",
                        "speaker": "Speaker 1", # Mocked speaker diarization
                        "text": text
                    })
                    await manager.broadcast_to_meeting(payload, meeting_id)
                    
            except Exception as e:
                logger.error(f"Error transcribing chunk: {e}")
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, meeting_id)
