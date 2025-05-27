import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, tap, catchError, throwError } from 'rxjs'
import {
  QuestionPublic,
  QuestionsPublicResponse,
  Question,
  CreateQuestionRequestDto,
  UpdateQuestionRequestDto,
  UserAnswerDto,
  CheckAnswersRequestDto,
  CheckAnswersResponseDto
} from '../models/question.model'

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly baseUrl = 'api/lessons'
  private readonly questionsUrl = 'questions'

  constructor(private http: HttpClient) {}

  getQuestionsByLesson(
    lessonId: number,
    page: number,
    size: number
  ): Observable<QuestionsPublicResponse> {
    const url = `${this.baseUrl}/${lessonId}/${this.questionsUrl}`
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    return this.http
      .get<QuestionsPublicResponse>(url, { params })
      .pipe(
        tap(() => console.log('GET questions', url)),
        catchError(err => throwError(() => err))
      )
  }

  createQuestion(
    lessonId: number,
    request: CreateQuestionRequestDto
  ): Observable<Question> {
    const url = `${this.baseUrl}/${lessonId}/${this.questionsUrl}`
    return this.http
      .post<Question>(url, request)
      .pipe(
        tap(() => console.log('POST question', url)),
        catchError(err => throwError(() => err))
      )
  }

  updateQuestion(
    questionId: number,
    request: UpdateQuestionRequestDto
  ): Observable<Question> {
    const url = `/${this.questionsUrl}/${questionId}`
    return this.http
      .put<Question>(url, request)
      .pipe(
        tap(() => console.log('PUT question', url)),
        catchError(err => throwError(() => err))
      )
  }

  deleteQuestion(questionId: number): Observable<void> {
    const url = `/${this.questionsUrl}/${questionId}`
    return this.http
      .delete<void>(url)
      .pipe(
        tap(() => console.log('DELETE question', url)),
        catchError(err => throwError(() => err))
      )
  }

  checkAnswers(
    answers: UserAnswerDto[]
  ): Observable<CheckAnswersResponseDto> {
    const url = `api/questions/answers/check`
    const body: CheckAnswersRequestDto = { answers }
    return this.http
      .post<CheckAnswersResponseDto>(url, body)
      .pipe(
        tap(() => console.log('POST check answers', url)),
        catchError(err => throwError(() => err))
      )
  }

}
