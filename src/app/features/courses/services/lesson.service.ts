// src/app/services/lesson.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Lesson, CreateLessonRequestDto } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  // если у вас бэкенд на порту 8080, пробрасывайте его здесь или через proxy.conf.json
  private readonly apiUrl = '/lessons';

  constructor(private http: HttpClient) {}

  createLesson(request: CreateLessonRequestDto): Observable<void> {
    // логируем куда уходим и с чем
    console.log('🌐 POST →', this.apiUrl, 'payload:', request);

    return this.http.post<void>(this.apiUrl, request).pipe(
      tap(() => console.log('✅ POST succeeded:', this.apiUrl)),
      catchError(err => {
        console.error('❌ POST failed:', this.apiUrl, err);
        return throwError(() => err);
      })
    );
  }

  getLessons(): Observable<Lesson[]> {
    console.log('🌐 GET  →', this.apiUrl);
    return this.http.get<Lesson[]>(this.apiUrl).pipe(
      tap(() => console.log('✅ GET succeeded:', this.apiUrl)),
      catchError(err => {
        console.error('❌ GET failed:', this.apiUrl, err);
        return throwError(() => err);
      })
    );
  }
}
