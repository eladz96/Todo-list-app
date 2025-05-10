import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from '../../components/new-task/new-task.component';
import { EditTaskComponent } from '../../components/edit-task/edit-task.component';

type TaskPriority = 'high' | 'medium' | 'low';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NewTaskComponent, EditTaskComponent],
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
  showEditPopup = false;
  editTaskData: any = null;

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
          const raw = task.priority?.toLowerCase();
          const validPriorities: TaskPriority[] = ['high', 'medium', 'low'];

          if (raw && validPriorities.includes(raw as TaskPriority)) {
            const priority = raw as TaskPriority;
            this.tasksByPriority[priority].push({ ...task, showMenu: false });
          } else {
            console.warn('❌ Skipped task with invalid priority:', task.priority, task);
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

  toggleMenu(task: any): void {
    Object.values(this.tasksByPriority).flat().forEach(t => t.showMenu = false);
    task.showMenu = !task.showMenu;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = target.closest('.task-menu-wrapper');
    if (!clickedInsideMenu) {
      Object.values(this.tasksByPriority).flat().forEach(t => t.showMenu = false);
    }
  }

  editTask(task: any): void {
    this.editTaskData = task;
    this.showEditPopup = true;
    task.showMenu = false;
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
    this.editTaskData = null;
  }

  deleteTask(task: any): void {
    task.showMenu = false;

    const confirmed = confirm(`Are you sure you want to delete "${task.headline}"?`);
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.delete(`http://localhost:3000/tasks/${task._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.refreshTasks(),
      error: (err) => {
        console.error('Failed to delete task:', err);
        alert('Something went wrong. Could not delete task.');
      }
    });
  }
}
