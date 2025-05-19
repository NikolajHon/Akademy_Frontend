// assignment-list.component.ts
import {Component, Input, signal, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Assignment,
  SubmissionResponseDto,
} from '../../models/assignment.model';
import { AssignmentService } from '../../services/assignment.service';
import { SubmissionResultComponent } from '../submission-result/submission-result.component';
import {UserService} from '../../../../core/services/user.service';
import {UserRole} from '../../../../core/models/user-role-enum';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SubmissionResultComponent
  ],
  templateUrl: './assignment-list.component.html'
})
export class AssignmentListComponent {
  @Input() assignments: Assignment[] = [];

  loading: Record<number, boolean> = {};
  results: Record<number, SubmissionResponseDto> = {};
  private userService       = inject(UserService);
  readonly userSignal = this.userService.getUserSignal();
  readonly isTeacher = computed(() => this.userSignal()?.role === UserRole.TEACHER);

  constructor(
    private service: AssignmentService
  ) {}

  submit(a: Assignment, code: string): void {
    this.loading[a.id] = true;
    this.service.submitAssignment(a.id, code).subscribe({
      next: res => (this.results[a.id] = res),
      error: err => console.error(err),
      complete: () => (this.loading[a.id] = false),
    });
  }

  delete(a: Assignment): void {
    if (!confirm(`Удалить задание "${a.description}"?`)) return;
    this.loading[a.id] = true;
    this.service.deleteAssignment(a.id).subscribe({
      next: () => {
        // убираем из списка
        this.assignments = this.assignments.filter(x => x.id !== a.id);
      },
      error: err => console.error(err),
      complete: () => (this.loading[a.id] = false),
    });
  }
}
