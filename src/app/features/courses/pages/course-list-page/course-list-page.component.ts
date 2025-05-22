import {
  Component, OnInit,
  WritableSignal, signal, computed, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

import { CourseListComponent } from
    '../../components/course-list/course-list.component';

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

  // Сигналы для списка и поиска
  private coursesSig: WritableSignal<Course[]> = signal([]);
  private searchQuery: WritableSignal<string> = signal('');

  // Сигналы для модалки
  isModalOpen: WritableSignal<boolean> = signal(false);
  newCourseName = '';
  newCourseDescription = '';

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return !q
      ? this.coursesSig()
      : this.coursesSig().filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
  });

  ngOnInit() {
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
    this.router.navigate(['/course-page', id]);
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
