// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, tap, catchError, throwError} from 'rxjs';
import { Course } from '../models/course.model';
import {CreateLessonRequestDto} from '../models/lesson.model';

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
  createLesson(request: CreateLessonRequestDto): Observable<void> {
    const url = `${this.apiUrl}/lessons`;

    return this.http.post<void>(url, request).pipe(
      tap(() => console.log('✅ POST succeeded:', url)),
      catchError(err => throwError(() => err))
    );
  }

  getCompletedLessonIds(courseId: number, userId: string): Observable<number[]> {
    return this.http
      .get<{ lessons: number[] }>(
        `${this.apiUrl}/${courseId}/users/${userId}/progress`
      )
      .pipe(map(resp => resp.lessons));
  }

  addCompletedLesson(courseId: number, userId: string, lessonId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${courseId}/users/${userId}/progress/lessons/${lessonId}`,
      null
    );
  }

  removeCompletedLesson(courseId: number, userId: string, lessonId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${courseId}/users/${userId}/progress/lessons/${lessonId}`
    );
  }

}
