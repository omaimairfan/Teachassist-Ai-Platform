import { Component, ChangeDetectorRef } from '@angular/core';
import { TransformService } from '../services/transform.service';

@Component({
  selector: 'app-transform',
  templateUrl: './transform.component.html',
  styleUrls: ['./transform.css']
})
export class TransformComponent {

  sourceFile!: File;
  templateFile!: File;
  outputType: string = 'excel';

  result: any = null;
  error: string | null = null;

  showMapping: boolean = false;
  loading: boolean = false;

  constructor(
    private api: TransformService,
    private cdr: ChangeDetectorRef
  ) {}

  // ===== FILE INPUT HANDLERS =====
  onSource(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.sourceFile = input.files[0];
    }
  }

  onTemplate(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.templateFile = input.files[0];
    }
  }

  // ===== SUBMIT =====
  submit() {
    this.error = null;

    if (!this.sourceFile || !this.templateFile) {
      this.error = 'Please upload both source and template files.';
      return;
    }

    this.loading = true;

    this.api.transform(
      this.sourceFile,
      this.templateFile,
      this.outputType
    ).subscribe({
      next: (res: any) => {
        this.result = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Transformation failed. Please try again.';
        this.loading = false;
      }
    });
  }

  // ===== UI HELPERS =====
  toggleMapping() {
    this.showMapping = !this.showMapping;
  }

  download() {
    if (!this.result?.file) return;

    window.open(
      `http://127.0.0.1:8000/transform/uploads/${this.result.file}`,
      '_blank'
    );
  }
}
