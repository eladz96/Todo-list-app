import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from '../../components/new-task/new-task.component';

type TaskPriority = 'high' | 'medium' | 'low';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NewTaskComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  tasksByPriority: Record<TaskPriority, any[]> = {
    high: [],
    medium: [],
    low: []
  };

  displayOrder: TaskPriority[] = [];
  userName: string = '';
  showNewTask = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || '';
    this.loadTasks();
  }

  loadTasks(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any[]>('http://localhost:3000/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (tasks) => {
        this.tasksByPriority = { high: [], medium: [], low: [] };

        tasks.forEach(task => {
          const priority = task.priority.toLowerCase() as TaskPriority;
          if (this.tasksByPriority[priority]) {
            this.tasksByPriority[priority].push(task);
          }
        });

        this.displayOrder = (['high', 'medium', 'low'] as TaskPriority[]).filter(
          p => this.tasksByPriority[p].length > 0
        );
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  openTaskPopup(): void {
    this.showNewTask = true;
  }

  closeTaskPopup(): void {
    this.showNewTask = false;
  }

  refreshTasks(): void {
    this.loadTasks();
  }
}
