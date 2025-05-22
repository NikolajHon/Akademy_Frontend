import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  course = signal<Course | null>(null);
  private userSignal = this.userService.getUserSignal();
  isTeacher = computed(() => this.userSignal()?.role === UserRole.TEACHER);

  showCreateModal = signal(false);
  newLesson = signal<CreateLessonRequestDto>({
    title: '',
    description: '',
    content: '',
    courseId: 0
  });

  showUsersModal = signal(false);
  users = signal<UserDto[]>([]);
  filterTerm = signal('');
  private currentCourseId = computed(() => this.course()?.id ?? 0);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getCourses().subscribe(list => {
      const found = list.find(c => c.id === id) || null;
      this.course.set(found);
      if (found) {
        this.newLesson.update(dto => ({ ...dto, courseId: found.id }));
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  createLesson(): void {
    const dto = this.newLesson();
    if (!dto.courseId) return;

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
    if (this.isEnrolled(user)) {
      console.log(`User ${user.id} is already enrolled in course ${courseId}`);
      return;
    }

    console.log(`Enrolling user ${user.id} into course ${courseId}`);
    this.userService.enrollUserToCourse(user.id, courseId).subscribe({
      next: () => {
        console.log(`Successfully enrolled user ${user.id} in course ${courseId}`);
        this.loadUsers();
      },
      error: err => {
        console.error('Enrollment error:', err);
      }
    });
  }

  filteredUsers(): UserDto[] {
    const term = this.filterTerm().trim().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(u =>
      (`${u.givingName} ${u.familyName}`.toLowerCase().includes(term)) ||
      u.email.toLowerCase().includes(term)
    );
  }

  isEnrolled(user: UserDto): boolean {
    return user.courses.some((c: CourseDto) => c.id === this.currentCourseId());
  }
}
