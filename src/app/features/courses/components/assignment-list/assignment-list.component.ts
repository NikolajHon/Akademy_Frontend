import { Component, Input } from '@angular/core';
import {
  Assignment,
  SubmissionResponseDto,
} from '../../models/assignment.model';
import { AssignmentService } from '../../services/assignment.service';
import {SubmissionResultComponent} from '../submission-result/submission-result.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-assignment-list',
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

  constructor(private service: AssignmentService) {}

  submit(a: Assignment, code: string): void {
    this.loading[a.id] = true;

    this.service.submitAssignment(a.id, code).subscribe({
      next: res => (this.results[a.id] = res),
      error: err => console.error(err),
      complete: () => (this.loading[a.id] = false),
    });
  }
}
