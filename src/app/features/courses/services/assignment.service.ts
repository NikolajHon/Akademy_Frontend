import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { Assignment, CreateAssignmentRequestDto } from '../models/assignment.model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly apiUrl = '/lessons';

  constructor(private http: HttpClient) {}

  getAssignmentsByLesson(lessonId: number): Observable<Assignment[]> {
    const url = `${this.apiUrl}/${lessonId}/assignments`;
    console.log('🌐 GET →', url);
    return this.http.get<Assignment[]>(url).pipe(
      tap(() => console.log('✅ GET succeeded:', url)),
      catchError(err => throwError(() => err))
    );
  }

  createAssignment(lessonId: number, request: CreateAssignmentRequestDto): Observable<Assignment> {
    const url = `${this.apiUrl}/${lessonId}/assignments`;
    console.log('🌐 POST →', url);
    return this.http.post<Assignment>(url, request).pipe(
      tap(() => console.log('✅ POST succeeded:', url)),
      catchError(err => throwError(() => err))
    );
  }
}
