import json
import logging
from typing import Dict, Any, List
import google.generativeai as genai
from app.config.settings import settings
from app.ai import prompts

logger = logging.getLogger(__name__)

# Initialize Gemini Client
genai.configure(api_key=settings.GEMINI_API_KEY)

class LLMClient:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name
        # Note: Depending on the library version, JSON forcing can be done via generation_config.
        self.model = genai.GenerativeModel(self.model_name)

    def _call_llm_json(self, system_prompt: str, user_content: str) -> Dict[str, Any]:
        """Calls Gemini and expects a JSON response."""
        try:
            # We combine system prompt and user content for Gemini
            full_prompt = f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nUSER INPUT:\n{user_content}\n\nStrictly return only valid JSON."
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            content = response.text
            return json.loads(content) if content else {}
        except Exception as e:
            logger.error(f"Error calling Gemini (JSON mode): {e}")
            return {}

    def _call_llm_text(self, system_prompt: str, user_content: str) -> str:
        """Calls Gemini for standard text response."""
        try:
            full_prompt = f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nUSER INPUT:\n{user_content}"
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7
                )
            )
            return response.text or ""
        except Exception as e:
            logger.error(f"Error calling Gemini (Text mode): {e}")
            return ""

    def extract_tasks(self, transcript: str) -> List[Dict]:
        prompt = prompts.PROMPT_TASK_EXTRACTION.replace("{transcript}", transcript)
        result = self._call_llm_json(prompt, "Extract tasks.")
        return result.get("tasks", [])

    def extract_decisions(self, transcript: str) -> List[str]:
        prompt = prompts.PROMPT_DECISION_DETECTION.replace("{transcript}", transcript)
        result = self._call_llm_json(prompt, "Extract decisions.")
        return result.get("decisions", [])

    def extract_timeline(self, transcript: str) -> List[Dict]:
        prompt = prompts.PROMPT_TIMELINE_EXTRACTION.replace("{transcript}", transcript)
        result = self._call_llm_json(prompt, "Extract timeline events.")
        return result.get("events", [])

    def generate_summary(self, transcript: str) -> str:
        prompt = prompts.PROMPT_MEETING_SUMMARY.replace("{transcript}", transcript)
        return self._call_llm_text(prompt, "Summarize this meeting.")

    def integrate_notes(self, transcript: str, user_notes: str) -> Dict[str, Any]:
        prompt = prompts.PROMPT_INTEGRATE_NOTES.replace("{transcript}", transcript).replace("{user_notes}", user_notes)
        return self._call_llm_json(prompt, "Integrate transcript and notes.")

    def chat(self, context: str, query: str) -> str:
        prompt = prompts.PROMPT_CHATBOT.replace("{context}", context).replace("{query}", query)
        return self._call_llm_text(prompt, query)

llm_client = LLMClient()
