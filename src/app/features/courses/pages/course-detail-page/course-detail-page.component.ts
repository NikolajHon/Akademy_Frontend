// src/app/pages/course-detail-page/course-detail-page.component.ts
import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LessonsListComponent } from '../../components/lessons-list/lessons-list.component';
import { TopFiveListComponent } from '../../components/top-five-list/top-five-list.component';

import { CourseService } from '../../services/course.service';
import { LessonService } from '../../services/lesson.service';

import { Course } from '../../models/course.model';
import { Lesson, CreateLessonRequestDto } from '../../models/lesson.model';
import {UserService} from '../../../../core/services/user.service';
import {UserRole} from '../../../../core/models/user-role-enum';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LessonsListComponent,
    TopFiveListComponent
  ],
  templateUrl: './course-detail-page.component.html',
  styleUrls: ['./course-detail-page.component.scss']
})
export class CourseDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private lessonService = inject(LessonService);
  private userService = inject(UserService);

  course = signal<Course|null>(null);

  private userSignal = this.userService.getUserSignal();
  isTeacher = computed(() => this.userSignal()?.role === UserRole.TEACHER);

  showCreateModal = signal(false);
  newLesson = signal<CreateLessonRequestDto>({
    title: '',
    description: '',
    content: '',
    courseId: 0
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // загрузить курс и сразу проставить courseId в dto
    this.courseService.getCourses().subscribe(list => {
      const found = list.find(c => c.id === id) || null;
      this.course.set(found);
      if (found) {
        this.newLesson.update(dto => ({ ...dto, courseId: found.id }));
      }
    });
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }
  closeModal() {
    this.showCreateModal.set(false);
  }

  createLesson() {
    const dto = this.newLesson();
    if (!dto.courseId) return;

    this.lessonService.createLesson(dto).subscribe(() => {
      // перезагрузим уроки в курсе
      this.courseService.getCourses().subscribe(list => {
        this.course.set(list.find(c => c.id === dto.courseId) || null);
      });
      this.closeModal();
      // очистить форму
      this.newLesson.set({ title: '', description: '', content: '', courseId: dto.courseId });
    });
  }
  updateTitle(value: string) {
    this.newLesson.update(l => ({ ...l, title: value }));
  }
  updateDescription(value: string) {
    this.newLesson.update(l => ({ ...l, description: value }));
  }
  updateContent(value: string) {
    this.newLesson.update(l => ({ ...l, content: value }));
  }

}
