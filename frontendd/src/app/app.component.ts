import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  selectedFile: File | null = null;

  examType = 'quiz';
  mcqs = 10;
  shorts = 5;
  longs = 2;
  difficulty = 'Medium';
  blooms = 'Understand';
  marks = 'MCQ=1, Short=5, Long=10';
  instructions = '';

  loading = false;
  result: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  generate() {
    if (!this.selectedFile) {
      alert("Please upload a file");
      return;
    }

    this.loading = true;

    const form = new FormData();
    form.append("exam_type", this.examType);
    form.append("mcqs", this.mcqs.toString());
    form.append("shorts", this.shorts.toString());
    form.append("longs", this.longs.toString());
    form.append("difficulty", this.difficulty);
    form.append("blooms", this.blooms);
    form.append("marks", this.marks);
    form.append("instructions", this.instructions);
    form.append("file", this.selectedFile);

    this.http.post<any>(`${environment.apiUrl}/api/generate-exam`, form)
      .subscribe({
        next: res => {
          this.result = res.content;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          alert("Generation failed");
          this.loading = false;
        }
      });
  }
}
