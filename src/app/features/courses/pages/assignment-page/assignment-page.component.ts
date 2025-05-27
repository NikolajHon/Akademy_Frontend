// src/app/features/assignments/pages/assignment-page/assignment-page.component.ts
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
import { ToastService } from '../../services/toast.service';
import { NotificationComponent } from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [
    CommonModule,
    AssignmentListComponent,
    AssignmentSidebarComponent,
    AssignmentCreateModalComponent,
    NotificationComponent
  ],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.scss'
})
export class AssignmentPageComponent implements OnInit {
  assignments: Assignment[] = [];
  lessonId!: number;
  showCreateModal = false;

  public user!: ReturnType<UserService['getUserSignal']>;
  public UserRole = UserRole;

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private userService: UserService,
    private toast: ToastService
  ) {
    this.user = this.userService.getUserSignal();
  }

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAssignments();
  }

  private loadAssignments(): void {
    if (!this.lessonId) return;
    this.assignmentService.getAssignmentsByLesson(this.lessonId).subscribe({
      next: data => {
        this.assignments = data;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.assignmentService.getAssignmentsByLesson(this.lessonId).subscribe({
      next: data => {
        this.assignments = data;
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
