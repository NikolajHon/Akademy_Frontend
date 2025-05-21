import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  tap,
  throwError,
  map            // 👈 импортируем оператор!
} from 'rxjs';
import {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
} from '../models/topic.model';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private readonly base = 'api/courses';

  constructor(private http: HttpClient) {}

  /** GET /courses/{courseId}/topics */
  getTopics(courseId: number): Observable<Topic[]> {
    const url = `${this.base}/${courseId}/topics`;
    return this.http.get<{ topics: Topic[] }>(url).pipe(
      tap(() => console.log('✅ topics loaded')),
      map(res => res.topics),           // ← теперь map взят из rxjs
      catchError(err => throwError(() => err))
    );
  }

  /** POST /courses/{courseId}/topics */
  createTopic(courseId: number, dto: CreateTopicRequest): Observable<Topic> {
    const url = `${this.base}/${courseId}/topics`;
    return this.http.post<Topic>(url, dto).pipe(
      tap(t => console.log('✅ topic created', t)),
      catchError(err => throwError(() => err))
    );
  }

  /** PUT /topics/{topicId} */
  updateTopic(id: number, dto: UpdateTopicRequest): Observable<Topic> {
    return this.http.put<Topic>(`api/topics/${id}`, dto);
  }
}
