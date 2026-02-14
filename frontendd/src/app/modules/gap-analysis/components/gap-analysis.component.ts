import { Component } from '@angular/core';
import { GapAnalysisService } from '../services/gap-analysis.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-gap-analysis',
  templateUrl: './gap-analysis.component.html',
  styleUrls: ['./gap-analysis.component.css']
})
export class GapAnalysisComponent {

  questionPaper!: File;
  marksheet!: File;
  result: any = null;
  loading = false;

  chart: Chart | null = null;

  constructor(private service: GapAnalysisService) {}

  onQuestionPaper(e: any) {
    this.questionPaper = e.target.files[0]; // File object store
  }

  onMarksheet(e: any) {
    this.marksheet = e.target.files[0]; // File object store
  }

  analyze() {
    if (!this.questionPaper || !this.marksheet) {
      alert('Please upload both files');
      return;
    }

    this.loading = true;

    this.service.analyze(this.questionPaper, this.marksheet).subscribe({
      next: (res) => {
        console.log('✅ API Response:', res);
        this.result = res; // Backend response store
        this.loading = false;

        // Render chart after data is loaded
        setTimeout(() => {
          this.renderChart();
        }, 0);
      },
      error: (err) => {
        console.error('❌ Backend error:', err);
        alert('Backend error: ' + (err.error?.detail || 'Unknown error'));
        this.loading = false;
      }
    });
  }

  // ================= EXPORT CSV WITH CLO =================
  exportToCSV() {
    if (!this.result?.gap_results) return;

    // Question-wise CSV with CLO
    let csv = 'Question,CLO,Max Marks,Threshold Marks,Students Below Threshold,Gap %,Student Names,Status\n';

    this.result.gap_results.forEach((r: any) => {
      const studentNames = (r.student_names || []).join(' | ');
      csv += `${r.question},${r.clo},${r.max_marks},${r.threshold_marks},${r.students_below_threshold},${r.gap_percentage},"${studentNames}",${r.status}\n`;
    });

    // Add CLO-wise summary
    if (this.result.clo_results && this.result.clo_results.length > 0) {
      csv += '\n\nCLO-wise Analysis\n';
      csv += 'CLO,Questions,Max Marks,Threshold Marks,Students Below,Gap %,Status\n';
      
      this.result.clo_results.forEach((clo: any) => {
        csv += `${clo.clo},"${clo.questions.join(', ')}",${clo.max_marks},${clo.threshold_marks},${clo.students_below_threshold},${clo.gap_percentage},${clo.status}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gap_analysis_report_with_clo.csv';
    link.click();
  }

  // ================= CHART RENDERING =================
  renderChart() {
    if (!this.result?.gap_results) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.result.gap_results.map((r: any) => `${r.question} (${r.clo})`);
    const failed = this.result.gap_results.map((r: any) => r.gap_percentage);
    const passed = failed.map((f: number) => 100 - f);

    const canvas = document.getElementById('classChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Passed Students (%)',
            data: passed,
            backgroundColor: '#66bb6a'
          },
          {
            label: 'Below Threshold (%)',
            data: failed,
            backgroundColor: '#ef5350'
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            max: 100,
            stacked: true,
            title: {
              display: true,
              text: 'Class Percentage'
            }
          },
          y: {
            stacked: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const value = context.parsed?.x ?? 0;
                return context.dataset.label + ': ' + value.toFixed(1) + '%';
              }
            }
          }
        }
      }
    });
  }
}