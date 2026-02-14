import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GenerateExamComponent } from './pages/generate-exam/generate-exam.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
const routes: Routes = [

  // ❌ NO SIDEBAR
  { path: 'login', component: LoginComponent },

  // ✅ WITH SIDEBAR
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'generate', component: GenerateExamComponent },
      { path: 'gap-analysis', loadChildren: () =>
          import('./modules/gap-analysis/gap-analysis.module')
          .then(m => m.GapAnalysisModule)
      },
      { path: 'transform', loadChildren: () =>
          import('./modules/transform/transform.module')
          .then(m => m.TransformModule)
      },
      { path: '', redirectTo: 'generate', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

