import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, Enum
from sqlalchemy.orm import relationship
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    participants = Column(Integer, default=0)
    transcript = Column(Text, nullable=True) # Full transcript text or structured JSON
    summary = Column(Text, nullable=True)

    # Relationships
    tasks = relationship("Task", back_populates="meeting", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="meeting", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEvent", back_populates="meeting", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="meeting", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    description = Column(String, nullable=False)
    owner = Column(String, nullable=True)
    priority = Column(String, default="Medium")
    deadline = Column(String, nullable=True)
    status = Column(String, default="Pending")

    meeting = relationship("Meeting", back_populates="tasks")


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String, primary_key=True, default=generate_uuid)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    decision_text = Column(String, nullable=False)
    timestamp = Column(String, nullable=True)

    meeting = relationship("Meeting", back_populates="decisions")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    timestamp = Column(String, nullable=False)
    event_type = Column(String, nullable=False) # e.g., 'topic_start', 'task_assigned', 'decision_made'
    description = Column(String, nullable=False)

    meeting = relationship("Meeting", back_populates="timeline_events")


class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, default=generate_uuid)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    note_text = Column(Text, nullable=False)

    meeting = relationship("Meeting", back_populates="notes")
