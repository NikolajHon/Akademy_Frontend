import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LessonsListComponent } from '../../components/lessons-list/lessons-list.component';
import { TopFiveListComponent } from '../../components/top-five-list/top-five-list.component';

import { CourseService } from '../../services/course.service';
import { LessonService } from '../../services/lesson.service';

import { Course } from '../../models/course.model';
import { Lesson, CreateLessonRequestDto } from '../../models/lesson.model';
import { UserService } from '../../../../core/services/user.service';
import { UserRole } from '../../../../core/models/user-role-enum';
import { CourseDto, UserDto, UsersResponseDto } from '../../../../core/models/user-model';

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

  completedLessonIds = signal<number[]>([]);
  course = signal<Course | null>(null);
  private userSignal = this.userService.getUserSignal();
  isTeacher = computed(() => this.userSignal()?.role === UserRole.TEACHER);
  radius = 20;
  circumference = 2 * Math.PI * this.radius;

  // Percentage of completed lessons
  completionPercentage = computed(() => {
    const total = this.course()?.lessons.length ?? 0;
    if (!total) return 0;
    const done = this.completedLessonIds().length;
    return Math.round((done / total) * 100);
  });
  showCreateModal = signal(false);
  newLesson = signal<CreateLessonRequestDto>({
    title: '',
    description: '',
    content: '',
    courseId: 0
  });
  constructor() {
    effect(() => {
      const user = this.userSignal();
      console.log('Current user ID from signal:', user?.id);
    });
  }
  showUsersModal = signal(false);
  users = signal<UserDto[]>([]);
  filterTerm = signal('');
  private currentCourseId = computed(() => this.course()?.id ?? 0);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const courseId = Number(params.get('id'));
      if (isNaN(courseId)) {
        console.error('Invalid course ID in URL:', params.get('id'));
        return;
      }

      // Обновляем поле для создания урока
      this.newLesson.update(l => ({ ...l, courseId }));

      // Загружаем данные курса
      this.courseService.getCourses().subscribe(list => {
        const found = list.find(c => c.id === courseId) || null;
        this.course.set(found);

        if (found) {
          const user = this.userSignal();
          if (user?.id != null) {
            this.courseService
              .getCompletedLessonIds(courseId, user.id)
              .subscribe(ids => this.completedLessonIds.set(ids));
          }
        }
      });
    });
  }
  onToggleLesson(lesson: Lesson) {
    const courseId = this.course()!.id;
    const userId   = this.userSignal()!.id;

    console.log('Keycloak user ID:', userId);

    if (this.completedLessonIds().includes(lesson.id)) {
      this.courseService
        .removeCompletedLesson(courseId, userId, lesson.id)
        .subscribe(() => {
          this.completedLessonIds.update(ids =>
            ids.filter(id => id !== lesson.id)
          );
        });
    } else {
      this.courseService
        .addCompletedLesson(courseId, userId, lesson.id)
        .subscribe(() => {
          this.completedLessonIds.update(ids => [...ids, lesson.id]);
        });
    }
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  createLesson(): void {
    const dto = this.newLesson();
    console.log(dto);
    if (!dto.courseId) return;
    console.log("we are here")
    this.lessonService.createLesson(dto).subscribe(() => {
      this.courseService.getCourses().subscribe(list => {
        this.course.set(list.find(c => c.id === dto.courseId) || null);
      });
      this.closeCreateModal();
      this.newLesson.set({ title: '', description: '', content: '', courseId: dto.courseId });
    });
  }

  updateTitle(value: string): void {
    this.newLesson.update(l => ({ ...l, title: value }));
  }

  updateDescription(value: string): void {
    this.newLesson.update(l => ({ ...l, description: value }));
  }

  updateContent(value: string): void {
    this.newLesson.update(l => ({ ...l, content: value }));
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((res: UsersResponseDto) => {
      this.users.set(res.users);
    });
  }

  openUsersModal(): void {
    this.loadUsers();
    this.showUsersModal.set(true);
  }

  closeUsersModal(): void {
    this.showUsersModal.set(false);
    this.filterTerm.set('');
  }

  onUserClick(user: UserDto): void {
    const courseId = this.currentCourseId();
    if (this.isEnrolled(user)) return;

    this.userService.enrollUserToCourse(user.id, courseId).subscribe({
      next: () => this.loadUsers(),
      error: err => console.error(err)
    });
  }

  filteredUsers(): UserDto[] {
    const term = this.filterTerm().trim().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(u =>
      `${u.givingName} ${u.familyName}`.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  isEnrolled(user: UserDto): boolean {
    return user.courses.some((c: CourseDto) => c.id === this.currentCourseId());
  }
}
