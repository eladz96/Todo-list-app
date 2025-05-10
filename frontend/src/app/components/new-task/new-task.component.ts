import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})

export class NewTaskComponent {
  headline = '';
  priority = '';
  description = '';

  @Output() closePopup = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  submitTask() {
    const token = localStorage.getItem('token');

    if (!token) return;

    const decoded = jwtDecode<DecodedToken>(token);
    const userId = decoded.userId;

    this.http.post('http://localhost:3000/tasks', {
      headline: this.headline,
      priority: this.priority,
      description: this.description,
      userId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.taskCreated.emit();
        this.closePopup.emit();
      },
      error: (err) => {
        console.error('Task creation failed', err);
      }
    });
  }

  close() {
    this.closePopup.emit();
  }
}