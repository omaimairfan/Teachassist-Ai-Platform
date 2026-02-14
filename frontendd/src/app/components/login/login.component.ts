import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  error: string | null = null;

  constructor(private router: Router) {}

  // ================= LOGIN =================
  onLogin(): void {
    this.error = null;

    const trimmedUser = this.username.trim();
    const trimmedPass = this.password.trim();

    if (!trimmedUser || !trimmedPass) {
      this.error = 'Please enter both username and password.';
      return;
    }

    // ✅ Dummy login
    if (trimmedUser === 'usmanwaheed' && trimmedPass === '1234') {
      localStorage.setItem('teacherName', trimmedUser);
      localStorage.setItem('token', 'dummy-token'); // important for guards

      this.router.navigate(['/generate']);
      return;
    }

    this.error = 'Invalid username or password (dummy check).';
  }

  // ================= LOGOUT =================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('user');
    sessionStorage.clear();

    this.router.navigate(['/login']);
  }
}
