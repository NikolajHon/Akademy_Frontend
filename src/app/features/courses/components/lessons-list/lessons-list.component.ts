import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../models/lesson.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lessons-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss']
})
export class LessonsListComponent {
  private router = inject(Router);
  @Input() lessons: Lesson[] = [];
  @Input() completedLessonIds: number[] = [];
  @Output() toggleLesson = new EventEmitter<Lesson>();

  isCompleted(lesson: Lesson): boolean {
    return this.completedLessonIds.includes(lesson.id);
  }

  onToggle(lesson: Lesson) {
    this.toggleLesson.emit(lesson);
  }
  openPractise(lesson: Lesson): void {
    console.log('Lesson:', lesson);
    console.log('CourseId:', lesson.courseId);
    console.log('LessonId:', lesson.id);

    this.router.navigate([
      '/course-page',
      lesson.courseId,
      'assignment',
      lesson.id
    ]);
  }
  openQuestions(lesson: Lesson) {
    this.router.navigate(['/course-page', lesson.id, 'questions']);
  }
  openVideo(lesson: Lesson) {
    this.router.navigate(['/course-page', lesson.id, 'video']);
  }


}
