// src/app/features/courses/services/question.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  Question,
  QuestionsResponse,
  CreateQuestionRequestDto,
  UpdateQuestionRequestDto
} from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly baseUrl = 'api/lessons';
  private readonly questionsUrl = 'api/questions';

  constructor(private http: HttpClient) {}

  getQuestionsByLesson(
    lessonId: number,
    page: number,
    size: number
  ): Observable<QuestionsResponse> {
    const url = `${this.baseUrl}/${lessonId}${this.questionsUrl}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    console.log('🌐 GET  →', url, params);
    return this.http
      .get<QuestionsResponse>(url, { params })
      .pipe(
        tap(() => console.log('✅ GET succeeded:', url)),
        catchError(err => throwError(() => err))
      );
  }

  getQuestion(questionId: number): Observable<Question> {
    const url = `${this.questionsUrl}/${questionId}`;
    console.log('🌐 GET  →', url);
    return this.http
      .get<Question>(url)
      .pipe(
        tap(() => console.log('✅ GET succeeded:', url)),
        catchError(err => throwError(() => err))
      );
  }

  createQuestion(
    lessonId: number,
    request: CreateQuestionRequestDto
  ): Observable<Question> {
    const url = `${this.baseUrl}/${lessonId}${this.questionsUrl}`;
    console.log('🌐 POST →', url, request);
    return this.http
      .post<Question>(url, request)
      .pipe(
        tap(() => console.log('✅ POST succeeded:', url)),
        catchError(err => throwError(() => err))
      );
  }

  updateQuestion(
    questionId: number,
    request: UpdateQuestionRequestDto
  ): Observable<Question> {
    const url = `${this.questionsUrl}/${questionId}`;
    console.log('🌐 PUT  →', url, request);
    return this.http
      .put<Question>(url, request)
      .pipe(
        tap(() => console.log('✅ PUT succeeded:', url)),
        catchError(err => throwError(() => err))
      );
  }

  deleteQuestion(questionId: number): Observable<void> {
    const url = `${this.questionsUrl}/${questionId}`;
    console.log('🌐 DELETE →', url);
    return this.http
      .delete<void>(url)
      .pipe(
        tap(() => console.log('✅ DELETE succeeded:', url)),
        catchError(err => throwError(() => err))
      );
  }
}
