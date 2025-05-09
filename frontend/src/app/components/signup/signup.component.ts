import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  message = '';

  @Output() close = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  onSignup() {
    this.http.post<any>('http://localhost:3000/users/register', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.message = 'User registered successfully!';
      },
      error: (err) => {
        this.message = err.error?.error || 'Registration failed';
      }
    });
  }

  closePopup(event: MouseEvent) {
    this.close.emit();
  }
}
