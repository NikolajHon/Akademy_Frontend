import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Course } from '../models/course.model';

export interface CreateCourseRequestDto {
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiUrl = 'api/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<{ courses: Course[] }>(this.apiUrl).pipe(
      map(response => response.courses)
    );
  }

  // Новый метод создания
  createCourse(dto: CreateCourseRequestDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto);
  }
}
