from fastapi import APIRouter, UploadFile, File

from app.services.paper_parser import parse_question_paper
from app.services.excel_parser import parse_marksheet
from app.services.gap_analyzer import analyze_gaps

router = APIRouter(
    prefix="/gap-analysis",
    tags=["Gap Analysis"]
)

@router.post("/")
async def gap_analysis(
    question_paper: UploadFile = File(...),
    marksheet: UploadFile = File(...)
):
    questions = await parse_question_paper(question_paper)
    students = await parse_marksheet(marksheet)
    return analyze_gaps(questions, students, threshold_percentage=30)
