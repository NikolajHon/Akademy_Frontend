import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LessonsListComponent } from '../../components/lessons-list/lessons-list.component';
import { TopFiveListComponent } from '../../components/top-five-list/top-five-list.component';

import { CourseService } from '../../services/course.service';
import { LessonService } from '../../services/lesson.service';

import { Course } from '../../models/course.model';
import { Lesson, CreateLessonRequestDto } from '../../models/lesson.model';
import {UserService} from '../../../../core/services/user.service';
import {CourseProgressWithUserDto, UserDto, UsersResponseDto} from '../../../../core/models/user-model';
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

  course          = signal<Course | null>(null);
  completedLessonIds = signal<number[]>([]);
  enrolledUsers   = signal<UserDto[]>([]);
  users           = signal<UserDto[]>([]);
  filterTerm      = signal('');

  private userSignal = this.userService.getUserSignal();
  isTeacher       = computed(() => this.userSignal()?.role === UserRole.TEACHER);

  showCreateModal = signal(false);
  newLesson       = signal<CreateLessonRequestDto>({
    title: '',
    description: '',
    content: '',
    courseId: 0
  });

  showUsersModal = signal(false);

  radius       = 20;
  circumference = 2 * Math.PI * this.radius;
  completionPercentage = computed(() => {
    const total = this.course()?.lessons.length ?? 0;
    if (!total) return 0;
    const done = this.completedLessonIds().length;
    return Math.round((done / total) * 100);
  });

  currentCourseId = computed(() => this.course()?.id ?? 0);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      if (isNaN(id)) return;
      this.newLesson.update(l => ({ ...l, courseId: id }));

      this.courseService.getCourses().subscribe(list => {
        this.course.set(list.find(c => c.id === id) || null);

        if (this.course()) {
          const userId = this.userSignal()?.id;
          if (userId) {
            this.courseService
              .getCompletedLessonIds(id, userId)
              .subscribe(ids => this.completedLessonIds.set(ids));
          }
        }
      });
    });
  }

  onToggleLesson(lesson: Lesson) {
    const courseId = this.currentCourseId();
    const userId = this.userSignal()!.id;
    if (this.completedLessonIds().includes(lesson.id)) {
      this.courseService
        .removeCompletedLesson(courseId, userId, lesson.id)
        .subscribe(() =>
          this.completedLessonIds.update(ids => ids.filter(x => x !== lesson.id))
        );
    } else {
      this.courseService
        .addCompletedLesson(courseId, userId, lesson.id)
        .subscribe(() =>
          this.completedLessonIds.update(ids => [...ids, lesson.id])
        );
    }
  }

  openCreateModal()  { this.showCreateModal.set(true); }
  closeCreateModal() { this.showCreateModal.set(false); }

  updateTitle(v: string)       { this.newLesson.update(l => ({ ...l, title: v })); }
  updateDescription(v: string) { this.newLesson.update(l => ({ ...l, description: v })); }
  updateContent(v: string)     { this.newLesson.update(l => ({ ...l, content: v })); }

  createLesson() {
    const dto = this.newLesson();
    if (!dto.courseId) return;
    this.lessonService.createLesson(dto).subscribe(() => {
      this.courseService.getCourses().subscribe(list =>
        this.course.set(list.find(c => c.id === dto.courseId) || null)
      );
      this.newLesson.set({ title: '', description: '', content: '', courseId: dto.courseId });
      this.closeCreateModal();
    });
  }

  openUsersModal(): void {
    const cid = this.currentCourseId();
    this.userService.getAllUsers().subscribe((res: UsersResponseDto) => {
      this.users.set(res.users);
    });
    this.userService
      .listCourseProgressByCourse(cid)
      .subscribe((list: CourseProgressWithUserDto[]) => {
        this.enrolledUsers.set(list.map(cp => cp.user));
        this.showUsersModal.set(true);
      });
  }

  closeUsersModal(): void {
    this.showUsersModal.set(false);
    this.filterTerm.set('');
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
    return this.enrolledUsers().some(u => u.id === user.id);
  }

  onUserClick(user: UserDto): void {
    const courseId = this.currentCourseId();

    if (this.isEnrolled(user)) {
      const msg = `Are you sure you want to remove ${user.givingName} ${user.familyName} from this course? This will delete all their progress.`;
      if (!window.confirm(msg)) {
        return;
      }
      this.userService.unenrollUserFromCourse(user.id, courseId)
        .subscribe(() => {
          this.userService
            .listCourseProgressByCourse(courseId)
            .subscribe(list => this.enrolledUsers.set(list.map(cp => cp.user)));
        });
    } else {
      this.userService.enrollUserToCourse(user.id, courseId)
        .subscribe(() => {
          this.userService
            .listCourseProgressByCourse(courseId)
            .subscribe(list => this.enrolledUsers.set(list.map(cp => cp.user)));
        });
    }
  }

}
