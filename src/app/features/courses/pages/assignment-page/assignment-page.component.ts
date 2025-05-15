import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { UserService } from '../../../../core/services/user.service';
import { UserRole } from '../../../../core/models/user-role-enum';
import { AssignmentListComponent } from '../../components/assignment-list/assignment-list.component';
import { AssignmentSidebarComponent } from '../../components/assignment-sidebar/assignment-sidebar.component';
import { AssignmentCreateModalComponent } from '../../components/assignment-create-modal/assignment-create-modal.component';
import {ToastService} from '../../services/toast.service';


@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [
    CommonModule,
    AssignmentListComponent,
    AssignmentSidebarComponent,
    AssignmentCreateModalComponent
  ],
  templateUrl: './assignment-page.component.html'
})
export class AssignmentPageComponent implements OnInit {
  assignments: Assignment[] = [];
  lessonId!: number;
  showCreateModal = false;
  public user!: ReturnType<UserService['getUserSignal']>;
  public UserRole = UserRole;

  // Внедряем ToastService в конструкторе
  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private userService: UserService,
    private toast: ToastService           // ← сюда
  ) {
    this.user = this.userService.getUserSignal();
  }

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAssignments();
  }

  private loadAssignments(): void {
    if (!this.lessonId) return;
    console.log('[AssignmentPage] loadAssignments() начинаем загрузку для урока', this.lessonId);
    this.assignmentService.getAssignmentsByLesson(this.lessonId).subscribe({
      next: (data) => {
        console.log('[AssignmentPage] loadAssignments.next(): получены данные', data);
        this.assignments = data;
        console.log('[AssignmentPage] вызываем toast.show(success)');
        this.toast.show({ type: 'success', message: 'Задания загружены' });
      },
      error: (err) => {
        console.error('[AssignmentPage] loadAssignments.error():', err);
        console.log('[AssignmentPage] вызываем toast.show(error)');
        this.toast.show({ type: 'error', message: 'Не удалось загрузить задания' });
      }
    });
  }

  closeCreateModal(): void {
    console.log('[AssignmentPage] closeCreateModal()');
    this.showCreateModal = false;
    this.assignmentService.getAssignmentsByLesson(this.lessonId).subscribe({
      next: (data) => {
        console.log('[AssignmentPage] после закрытия: данные', data);
        this.assignments = data;
        console.log('[AssignmentPage] вызываем toast.show(success) для создания');
        this.toast.show({ type: 'success', message: 'Новое задание успешно создано' });
      },
      error: (err) => {
        console.error('[AssignmentPage] ошибка при создании:', err);
        console.log('[AssignmentPage] вызываем toast.show(error) для создания');
        this.toast.show({ type: 'error', message: 'Ошибка при создании задания' });
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

}
