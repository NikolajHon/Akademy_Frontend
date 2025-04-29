import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-assignment-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-sidebar.component.html',
})
export class AssignmentSidebarComponent {
  @Input() assignments: Assignment[] = [];

  scrollToAssignment(assignmentId: number): void {
    const element = document.getElementById(`assignment-${assignmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.classList.add('highlighted');

      setTimeout(() => {
        element.classList.remove('highlighted');
      }, 2000);
    }
  }
}
