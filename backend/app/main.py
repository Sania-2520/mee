from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.config.settings import settings
import logging

from app.database.database import engine, Base
# Import routers
from app.routes import meetings, transcripts, insights, tasks, timeline, chatbot, live_meeting

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables matching models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend for MeetingMind AI Meeting Intelligence System"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Error Handling for structured responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    # Return structured error block format
    return JSONResponse(
        status_code=500,
        content={"error": "An internal server error occurred.", "details": str(exc)},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "Invalid request format or missing data", "details": exc.errors()},
    )

@app.get("/")
def read_root():
    return {"status": "ok", "service": settings.PROJECT_NAME}

# API Routing
api_prefix = settings.API_V1_STR

app.include_router(meetings.router, prefix=f"{api_prefix}/meetings", tags=["meetings"])
app.include_router(transcripts.router, prefix=f"{api_prefix}/transcript", tags=["transcripts"])
app.include_router(insights.router, prefix=f"{api_prefix}/insights", tags=["insights"])
app.include_router(tasks.router, prefix=f"{api_prefix}/tasks", tags=["tasks"])
app.include_router(timeline.router, prefix=f"{api_prefix}/timeline", tags=["timeline"])
app.include_router(chatbot.router, prefix=f"{api_prefix}/chat", tags=["chatbot"])
app.include_router(live_meeting.router, tags=["websockets"])

logger.info(f"Registered all routers. Listening on {api_prefix}")
