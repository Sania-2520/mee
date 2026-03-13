from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Tasks ---
class TaskBase(BaseModel):
    description: str
    owner: Optional[str] = None
    priority: str = "Medium"
    deadline: Optional[str] = None
    status: str = "Pending"

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: str
    meeting_id: str

    class Config:
        from_attributes = True

# --- Decisions ---
class DecisionBase(BaseModel):
    decision_text: str
    timestamp: Optional[str] = None

class DecisionCreate(DecisionBase):
    pass

class DecisionResponse(DecisionBase):
    id: str
    meeting_id: str

    class Config:
        from_attributes = True

# --- Timeline Events ---
class TimelineEventBase(BaseModel):
    timestamp: str
    event_type: str
    description: str

class TimelineEventCreate(TimelineEventBase):
    pass

class TimelineEventResponse(TimelineEventBase):
    id: str
    meeting_id: str

    class Config:
        from_attributes = True

# --- Notes ---
class NoteBase(BaseModel):
    note_text: str

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: str
    meeting_id: str

    class Config:
        from_attributes = True

# --- Meetings ---
class MeetingBase(BaseModel):
    title: str
    participants: int = 0
    transcript: Optional[str] = None
    summary: Optional[str] = None

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    id: str
    date: datetime
    
    tasks: List[TaskResponse] = []
    decisions: List[DecisionResponse] = []
    timeline_events: List[TimelineEventResponse] = []
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True

# --- Insights ---
class InsightsGenerateRequest(BaseModel):
    transcript: str

class InsightsResponse(BaseModel):
    key_notes: List[str]
    tasks: List[TaskBase]
    decisions: List[str]
    meeting_productivity_score: str = "0%"

class IntegrateNotesRequest(BaseModel):
    transcript: str
    user_notes: str

class TimelineGenerateRequest(BaseModel):
    transcript: str
