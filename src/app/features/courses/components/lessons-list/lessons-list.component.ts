import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../models/lesson.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lessons-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss']
})
export class LessonsListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() lessons: Lesson[] = [];
  @Input() completedLessonIds: number[] = [];
  @Output() toggleLesson = new EventEmitter<Lesson>();

  courseId!: string;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('CourseId not found in URL');
    } else {
      this.courseId = id;
    }
  }

  isCompleted(lesson: Lesson): boolean {
    return this.completedLessonIds.includes(lesson.id);
  }

  onToggle(lesson: Lesson) {
    this.toggleLesson.emit(lesson);
  }

  openPractise(lesson: Lesson): void {
    this.router.navigate([
      '/course-page',
      this.courseId,
      'assignment',
      lesson.id
    ]);
  }

  openQuestions(lesson: Lesson) {
    this.router.navigate(['/course-page',this.courseId,'lessons' ,lesson.id, 'questions']);
  }

  openVideo(lesson: Lesson) {
    this.router.navigate(['/course-page', lesson.id, 'video']);
  }
}
