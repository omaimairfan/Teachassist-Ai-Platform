import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GapAnalysisService {

  private API_URL = 'http://127.0.0.1:8000/gap-analysis';

  constructor(private http: HttpClient) {}

analyze(questionPaper: File, marksheet: File) {
  const formData = new FormData();
  formData.append('question_paper', questionPaper);
  formData.append('marksheet', marksheet);

  return this.http.post('http://127.0.0.1:8000/gap-analysis', formData);
}

}

