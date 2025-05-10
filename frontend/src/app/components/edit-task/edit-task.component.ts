import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent {
  @Input() task: any = {};
  @Output() updated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  headline = '';
  priority = '';
  description = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.headline = this.task.headline;
    this.priority = this.task.priority;
    this.description = this.task.description;
  }

  save() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.put(`http://localhost:3000/tasks/${this.task._id}`, {
      headline: this.headline,
      priority: this.priority,
      description: this.description
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.closed.emit();
        this.updated.emit();
      },
      error: (err) => {
        console.error('Failed to update task', err);
        alert('Failed to update task');
      }
    });

    
  }

  cancel() {
    this.closed.emit();
  }
}
