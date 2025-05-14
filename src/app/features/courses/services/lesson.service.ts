
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Lesson, CreateLessonRequestDto } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private readonly apiUrl = '/lessons';


  constructor(private http: HttpClient) {}

  createLesson(request: CreateLessonRequestDto): Observable<void> {

    return this.http.post<void>(this.apiUrl, request).pipe(
      tap(() => console.log('✅ POST succeeded:', this.apiUrl)),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  getLessons(): Observable<Lesson[]> {
    console.log('🌐 GET  →', this.apiUrl);
    return this.http.get<Lesson[]>(this.apiUrl).pipe(
      tap(() => console.log('✅ GET succeeded:', this.apiUrl)),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
  private base = 'http://localhost:8080';
  createAssignment(lessonId: number, payload: any): Observable<any> {
    return this.http.post(
      `${this.base}/lessons/${lessonId}/assignments`,
      payload
    );
  }
}
