import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  sidebarOpen = true;
  teacherName = 'usmanwaheed';

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

   logout(): void {
    // 🔥 clear everything
    localStorage.clear();
    sessionStorage.clear();

    // 🔁 go to login
    this.router.navigate(['/login']);
  }


  constructor(private router: Router) {}
}
