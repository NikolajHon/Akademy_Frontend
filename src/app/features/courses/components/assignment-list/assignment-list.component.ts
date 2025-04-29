import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-list.component.html',
})
export class AssignmentListComponent {
  @Input() assignments: Assignment[] = [];

  submitAssignment(assignment: Assignment): void {
    console.log('📝 Submit assignment:', assignment);
  }
}
