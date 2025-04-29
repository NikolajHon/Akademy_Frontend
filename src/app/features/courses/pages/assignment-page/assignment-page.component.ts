import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { ActivatedRoute } from '@angular/router';
import { AssignmentListComponent } from '../../components/assignment-list/assignment-list.component';
import { AssignmentSidebarComponent } from '../../components/assignment-sidebar/assignment-sidebar.component'; // <-- ВАЖНО!!! импорт компонента

@Component({
  selector: 'app-assignment-page',
  standalone: true,
  imports: [
    CommonModule,
    AssignmentListComponent,
    AssignmentSidebarComponent // <-- ОБЯЗАТЕЛЬНО добавить сюда!!!
  ],
  templateUrl: './assignment-page.component.html'
})
export class AssignmentPageComponent implements OnInit {
  assignments: Assignment[] = [];
  private lessonId!: number;

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('LessonId:', this.lessonId);

    if (this.lessonId) {
      this.assignmentService.getAssignmentsByLesson(this.lessonId).subscribe({
        next: (assignments) => this.assignments = assignments,
        error: (err) => console.error('Ошибка загрузки заданий:', err)
      });
    }
  }
}
