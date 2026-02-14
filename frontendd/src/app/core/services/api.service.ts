import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ===============================
   Response Model
================================ */
export interface GeneratedExam {
  id: number;
  exam_type: string;
  content: string;
}

/* ===============================
   API SERVICE
================================ */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // ✅ Single source of truth
  private BASE_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  /* ===============================
     GENERATE EXAM
  ================================ */
generateExam(form: FormData) {
  return this.http.post<any>(
    'http://127.0.0.1:8000/api/generate-exam',
    form
  );
}



  /* ===============================
     DOWNLOAD EXAM (PDF / DOCX)
  ================================ */
  downloadExam(
    id: number,
    format: 'pdf' | 'docx',
    includeAnswers: boolean
  ) {
    return this.http.get(
      `${this.BASE_URL}/download/${id}?format=${format}&include_answers=${includeAnswers}`,
      { responseType: 'blob' }
    );
  }

  /* ===============================
     AUTH (OPTIONAL)
  ================================ */
  registerTeacher(data: { username: string; password: string }) {
    return this.http.post(
      `${this.BASE_URL}/auth/register`,
      data
    );
  }

  loginTeacher(data: { username: string; password: string }) {
    return this.http.post(
      `${this.BASE_URL}/auth/login`,
      data
    );
  }
}
