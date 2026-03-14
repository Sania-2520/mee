import whisper
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Load whisper model once when server starts
MODEL_NAME = os.getenv("WHISPER_MODEL", "tiny")

try:
    model = whisper.load_model(MODEL_NAME)
    logger.info(f"Whisper model loaded successfully: {MODEL_NAME}")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    model = None


class TranscriptionService:

    def transcribe_audio_file(self, file_path: str) -> Optional[str]:
        """
        Transcribe an audio file using Whisper
        """

        # Check if model loaded
        if model is None:
            logger.error("Whisper model is not loaded")
            return None

        # Check file exists
        if not os.path.exists(file_path):
            logger.error(f"Audio file not found: {file_path}")
            return None

        try:
            result = model.transcribe(file_path)

            transcript = result.get("text", "").strip()

            logger.info("Transcription completed successfully")

            return transcript

        except Exception as e:
            logger.error(f"Error during transcription: {e}")
            return None


# Create reusable instance
transcription_service = TranscriptionService()