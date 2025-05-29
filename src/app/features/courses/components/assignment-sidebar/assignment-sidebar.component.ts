import { Component, Input } from '@angular/core';
import {NgForOf, ViewportScroller} from '@angular/common';
import {Assignment} from '../../models/assignment.model';

@Component({
  selector: 'app-assignment-sidebar',
  templateUrl: './assignment-sidebar.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./assignment-sidebar.component.scss']
})
export class AssignmentSidebarComponent {
  @Input() assignments: Assignment[] = [];

  constructor(private viewport: ViewportScroller) {}

  scrollToAssignment(id: number) {
    this.viewport.scrollToAnchor(`assignment-${id}`);
  }
}
