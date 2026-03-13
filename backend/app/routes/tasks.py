from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import schemas, models
from app.database.database import get_db
import csv
from io import StringIO

router = APIRouter()

@router.get("/", response_model=list[schemas.TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@router.patch("/{task_id}", response_model=schemas.TaskResponse)
def update_task_status(task_id: str, status: str, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = status
    db.commit()
    db.refresh(task)
    return task

@router.post("/export")
def export_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    
    # Create an in-memory CSV file
    f = StringIO()
    writer = csv.writer(f)
    writer.writerow(["ID", "Meeting ID", "Description", "Owner", "Priority", "Deadline", "Status"])
    
    for t in tasks:
        writer.writerow([t.id, t.meeting_id, t.description, t.owner, t.priority, t.deadline, t.status])
        
    response = Response(content=f.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=tasks_export.csv"
    return response
