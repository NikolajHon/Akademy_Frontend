import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Router } from '@angular/router';
import { CourseListComponent } from '../../components/course-list/course-list.component';


@Component({
  selector: 'app-course-list-page',
  standalone: true,
  imports: [CommonModule, CourseListComponent],
  templateUrl: `./course-list-page.component.html`,
})
export class CourseListPageComponent  implements OnInit {
  private router = inject(Router);
  private courseService = inject(CourseService);
  courses: Course[] = [];

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => (this.courses = data),
      error: (err) => console.error('Ошибка при загрузке курсов', err),
    });
  }

  openCourse(id: number): void {
    this.router.navigate(['/courses', id]);
  }
}
