import {Component, computed, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import {Course} from '../../models/course.model';
import {CourseService} from '../../services/course.service';
import { HttpErrorResponse } from '@angular/common/http';
import {CourseListComponent} from '../../components/course-list/course-list.component';
import {UserModel} from '../../../../core/models/user-model';
import {UserService} from '../../../../core/services/user.service';
import {UserRole} from '../../../../core/models/user-role-enum';

@Component({
  selector: 'app-course-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseListComponent],
  templateUrl: './course-list-page.component.html',
  styleUrls: ['./course-list-page.component.scss']
})
export class CourseListPageComponent implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);
  courses: Course[] = [];
  filtered: Course[] = [];
  private coursesSig: WritableSignal<Course[]> = signal([]);
  private searchQuery: WritableSignal<string> = signal('');
  private userService = inject(UserService);
  isModalOpen: WritableSignal<boolean> = signal(false);
  newCourseName = '';
  newCourseDescription = '';
  currentUser?: UserModel;

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return !q
      ? this.coursesSig()
      : this.coursesSig().filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
  });
  private userSignal = this.userService.getUserSignal();
  isTeacher       = computed(() => this.userSignal()?.role === UserRole.TEACHER);
  ngOnInit() {
    this.currentUser = this.userService.getUserSignal()!();
    this.loadCourses();
  }

  private loadCourses() {
    this.courseService.getCourses()
      .subscribe(list => this.coursesSig.set(list));
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  openCourse(id: number): void {
    if (this.currentUser?.role === UserRole.TEACHER) {
      this.router.navigate(['/course-page', id]);
    } else {
      this.userService.getUserCourseRating(this.currentUser!.id, id)
        .subscribe({
          next: () => {
            this.router.navigate(['/course-page', id]);
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 404) {
              window.alert(
                'You do not have access to this course. Contact your teacher to grant access.'
              );
            } else {
              console.error(err);
              window.alert('Failed to verify access to the course. Try again.');
            }
          }
        });
    }
  }

  // Открыть/закрыть модалку
  openNewCourseModal() {
    this.newCourseName = '';
    this.newCourseDescription = '';
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }

  // Отправка нового курса
  submitNewCourse() {
    const dto = {
      name: this.newCourseName.trim(),
      description: this.newCourseDescription.trim()
    };
    if (!dto.name) {
      return; // можно добавить уведомление
    }
    this.courseService.createCourse(dto)
      .subscribe(() => {
        this.closeModal();
        this.loadCourses();  // обновляем список после создания
      });
  }
}
