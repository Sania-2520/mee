import logging
from typing import Dict, Any
from app.ai.llm_client import llm_client

logger = logging.getLogger(__name__)

class InsightService:
    def __init__(self):
        pass

    def generate_all_insights(self, transcript: str) -> Dict[str, Any]:
        """Run all AI extractions in sequence for a complete meeting analysis."""
        try:
            logger.info("Generating full meeting insights...")
            tasks = llm_client.extract_tasks(transcript)
            decisions = llm_client.extract_decisions(transcript)
            timeline = llm_client.extract_timeline(transcript)
            summary = llm_client.generate_summary(transcript)

            return {
                "summary": summary,
                "tasks": tasks,
                "decisions": decisions,
                "timeline_events": timeline,
                "meeting_productivity_score": "85%" # Mock dynamic calculation for now
            }
        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            return {}

    def integrate_transcript_with_notes(self, transcript: str, user_notes: str) -> Dict[str, Any]:
        """Combine automated transcript with human notes for refined output."""
        try:
            result = llm_client.integrate_notes(transcript, user_notes)
            return result
        except Exception as e:
            logger.error(f"Error integrating notes: {e}")
            return {}

insight_service = InsightService()
