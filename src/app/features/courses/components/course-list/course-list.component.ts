import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  private router = inject(Router);
  private courseService = inject(CourseService);
  courses: Course[] = [];

  ngOnInit() {
    console.log('CourseListComponent инициализирован');
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Курсы получены:', courses);
      },
      error: (err) => {
        console.error('Ошибка при получении курсов:', err);
      }
    });
  }



  openCourse(id: number): void {
    console.log('Клик по курсу, id:', id);
    this.router.navigate(['/courses', id]);
  }

}
