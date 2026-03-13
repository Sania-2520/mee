import whisper
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Preload whisper model (using tiny for development speed; change to base/small in prod)
MODEL_NAME = os.getenv("WHISPER_MODEL", "tiny")
try:
    model = whisper.load_model(MODEL_NAME)
    logger.info(f"Loaded Whisper model: {MODEL_NAME}")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    model = None

class TranscriptionService:
    def __init__(self):
        pass

    def transcribe_audio_file(self, file_path: str) -> Optional[str]:
        """Transcribe an audio file using OpenAI Whisper."""
        if not model:
            logger.error("Whisper model is not loaded.")
            return None
            
        if not os.path.exists(file_path):
            logger.error(f"Audio file not found: {file_path}")
            return None

        try:
            result = model.transcribe(file_path)
            return result.get("text", "")
        except Exception as e:
            logger.error(f"Error during transcription: {e}")
            return None

transcription_service = TranscriptionService()
