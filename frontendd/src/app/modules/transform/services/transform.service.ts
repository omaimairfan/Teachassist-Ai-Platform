import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransformService {

  private apiUrl = 'http://127.0.0.1:8000/transform';

  constructor(private http: HttpClient) {}

  transform(
    source: File,
    template: File,
    outputType: string
  ): Observable<any> {

    const formData = new FormData();
    formData.append('source_file', source);
    formData.append('template_file', template);
    formData.append('output_type', outputType);

    return this.http.post(this.apiUrl, formData);
  }
}
