import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-lessons-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lessons-list.component.html'
})
export class LessonsListComponent {
  @Input() lessons: Lesson[] = [];

  @Output() goToLesson    = new EventEmitter<Lesson>();
  @Output() viewTasks     = new EventEmitter<Lesson>();
  @Output() startPractice = new EventEmitter<Lesson>();
  @Output() viewQuestions = new EventEmitter<Lesson>();
}
