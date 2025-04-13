import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Course, CourseService} from '../core/services/course.service';


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Курсы</h2>
    <ul>
      <li *ngFor="let course of courses">
        <strong>{{ course.name }}</strong><br />
        <small>{{ course.description }}</small>
      </li>
    </ul>
  `
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('Ошибка при загрузке курсов', err)
    });
  }
}
