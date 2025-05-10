import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks: any[] = [];
  userName: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || '';

    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any[]>('http://localhost:3000/tasks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => this.tasks = res,
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  openTaskPopup() {
    console.log('Add Task clicked');
    // TODO: trigger popup later
  }
}
