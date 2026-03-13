PROMPT_TASK_EXTRACTION = """
You are an AI assistant designed to extract actionable tasks from meeting transcripts.
Analyze the following transcript segment and identify any tasks, action items, or assignments.

For each task, provide:
- description: The clear task description.
- owner: The person assigned to the task (or null if unassigned).
- priority: High, Medium, or Low based on context.

Output strictly in valid JSON format matching this schema:
{
  "tasks": [
    {
      "description": "string",
      "owner": "string | null",
      "priority": "High | Medium | Low"
    }
  ]
}

Transcript:
{transcript}
"""

PROMPT_DECISION_DETECTION = """
You are an AI assistant analyzing meeting transcripts.
Identify any formal decisions, agreements, or conclusions reached by the participants.

Output strictly in valid JSON format matching this schema:
{
  "decisions": [
    "string"
  ]
}

Transcript:
{transcript}
"""

PROMPT_TIMELINE_EXTRACTION = """
You are an AI assistant analyzing a meeting transcript.
Identify significant events to build a meeting timeline.
Event types must be one of: 'topic_start', 'task_assigned', 'decision_made', 'important_discussion'.

Output strictly in valid JSON format matching this schema:
{
  "events": [
    {
      "timestamp": "string (MM:SS)",
      "type": "string",
      "description": "string"
    }
  ]
}

Transcript:
{transcript}
"""

PROMPT_MEETING_SUMMARY = """
You are an expert AI meeting summarizer.
Generate a concise, high-level summary of the meeting, capturing the main themes and outcomes.
Do not exceed 3 paragraphs.

Transcript:
{transcript}
"""

PROMPT_INTEGRATE_NOTES = """
You are an AI assistant designed to merge raw meeting transcripts with a user's personal shorthand notes.
Your goal is to produce improved, highly accurate meeting intelligence.

Output strictly in valid JSON format matching this schema:
{
  "key_notes": ["string"],
  "tasks": [{"description": "string", "owner": "string", "priority": "High|Medium|Low"}],
  "decisions": ["string"],
  "meeting_productivity_score": "string (e.g. 85%)"
}

Raw Transcript:
{transcript}

User's Personal Notes:
{user_notes}
"""

PROMPT_CHATBOT = """
You are a helpful AI Meeting Assistant answering questions about a specific meeting.
Use the provided meeting context to answer the user's query. If the answer is not in the context, politely say so.

Meeting Context:
{context}

User Query:
{query}
"""
