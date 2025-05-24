// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Course } from '../models/course.model';

export interface CreateCourseRequestDto {
  name: string;
  description: string;
}

export interface AddLessonRequestDto {
  lessonId: number;
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

  createCourse(dto: CreateCourseRequestDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto);
  }

  getCompletedLessonIds(courseId: number, userId: number): Observable<number[]> {
    return this.http
      .get<{ lessons: number[] }>(
        `${this.apiUrl}/${courseId}/users/2/progress`
      )
      .pipe(map(resp => resp.lessons));
  }

  addCompletedLesson(courseId: number, userId: number, lessonId: number): Observable<void> {
    const body: AddLessonRequestDto = { lessonId };
    return this.http.post<void>(
      `${this.apiUrl}/${courseId}/users/2/progress`,
      body
    );
  }

  removeCompletedLesson(courseId: number, userId: number, lessonId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${courseId}/users/2/progress/lessons/${lessonId}`
    );
  }
}
