import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  Assignment,
  CreateAssignmentRequestDto,
  SubmissionRequestDto,
  SubmissionResponseDto,
} from '../models/assignment.model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly lessonsUrl = 'api/lessons';

  constructor(private http: HttpClient) {}

  getAssignmentsByLesson(lessonId: number): Observable<Assignment[]> {
    const url = `${this.lessonsUrl}/${lessonId}/assignments`;
    return this.http.get<Assignment[]>(url).pipe(
      tap(() => console.log('✅ GET assignments', url)),
      catchError(err => throwError(() => err))
    );
  }

  createAssignment(
    lessonId: number,
    req: CreateAssignmentRequestDto
  ): Observable<Assignment> {
    const url = `${this.lessonsUrl}/${lessonId}/assignments`;
    return this.http.post<Assignment>(url, req).pipe(
      tap(() => console.log('✅ POST assignment', url)),
      catchError(err => throwError(() => err))
    );
  }

  submitAssignment(
    assignmentId: number,
    code: string
  ): Observable<SubmissionResponseDto> {
    const url = `api/assignments/${assignmentId}/submissions`;
    const body: SubmissionRequestDto = { code };
    return this.http.post<SubmissionResponseDto>(url, body).pipe(
      tap(() => console.log('✅ SUBMIT', url)),
      catchError(err => throwError(() => err))
    );
  }

  deleteAssignment(assignmentId: number): Observable<void> {
    const url = `api/assignments/${assignmentId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log('✅ DELETE assignment', url)),
      catchError(err => throwError(() => err))
    );
  }
}
