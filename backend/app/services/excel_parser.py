import re
from io import BytesIO
from typing import Any, Dict, List, Optional

import pandas as pd
from fastapi import UploadFile


def _read_excel_bytes(upload: UploadFile) -> pd.DataFrame:
    file_bytes = upload.file.read()
    if not file_bytes:
        raise ValueError("Empty marksheet file")
    return pd.read_excel(BytesIO(file_bytes), engine="openpyxl")


def _find_name_column(columns: List[str]) -> Optional[str]:
    # Accept: Student Name, Name, Full Name, Student, Learner Name, etc.
    lowered = {c: str(c).strip().lower() for c in columns}

    # priority list
    priority = [
        "student name", "student_name", "full name", "fullname", "name", "student"
    ]
    for p in priority:
        for col, cl in lowered.items():
            if p == cl:
                return col

    # fallback: any column containing "name"
    for col, cl in lowered.items():
        if "name" in cl:
            return col

    return None


def _normalize_qid(text: str) -> Optional[str]:
    """
    Accepts:
    Q1, Q 1, q01, Q1(5), Q1 Marks, Question 1, Question-1, Q-1, etc.
    Returns normalized "Q1"
    """
    s = str(text).strip()

    # common patterns
    patterns = [
        r"\bQ\s*[-:]?\s*0*(\d+)\b",
        r"\bQuestion\s*[-:]?\s*0*(\d+)\b",
    ]
    for pat in patterns:
        m = re.search(pat, s, flags=re.IGNORECASE)
        if m:
            return f"Q{int(m.group(1))}"
    return None


async def parse_marksheet(marksheet: UploadFile) -> List[Dict[str, Any]]:
    df = _read_excel_bytes(marksheet)

    df.columns = [str(c).strip() for c in df.columns]
    cols = df.columns.tolist()

    name_col = _find_name_column(cols)
    if not name_col:
        raise ValueError(
            "Excel must contain a student name column (e.g., 'Student Name' or 'Name'). "
            f"Found columns: {cols}"
        )

    # map question columns
    q_map: Dict[str, str] = {}
    for c in cols:
        qid = _normalize_qid(c)
        if qid:
            q_map[qid] = c

    if not q_map:
        raise ValueError(
            "No question columns found in Excel. Please include columns like Q1, Q2, Q3... "
            "or 'Question 1', 'Q1 Marks', etc."
        )

    students: List[Dict[str, Any]] = []
    for _, row in df.iterrows():
        nm = row.get(name_col, "")
        if pd.isna(nm) or str(nm).strip() == "":
            continue

        marks: Dict[str, float] = {}
        for qid, orig_col in q_map.items():
            val = row.get(orig_col, 0)
            if pd.isna(val):
                val = 0
            try:
                marks[qid] = float(val)
            except Exception:
                marks[qid] = 0.0

        students.append({"name": str(nm).strip(), "marks": marks})

    if not students:
        raise ValueError("No student rows detected in Excel")

    return students
