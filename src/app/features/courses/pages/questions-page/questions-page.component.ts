import {Component, computed, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import {
  QuestionPublic,
  QuestionsPublicResponse,
  CreateQuestionRequestDto,
  UserAnswerDto,
  CheckAnswersResponseDto
} from '../../models/question.model';
import {QuestionsListComponent} from '../../components/questions-list/questions-list.component';
import {QuestionCreateModalComponent} from '../../components/question-create-modal/question-create-modal.component';
import {NgIf} from '@angular/common';
import {UserRole} from '../../../../core/models/user-role-enum';
import {UserService} from '../../../../core/services/user.service';
import {NotificationComponent} from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  imports: [
    QuestionsListComponent,
    QuestionCreateModalComponent,
    NgIf,
    NotificationComponent
  ],
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit {
  lessonId!: number;
  questions: QuestionPublic[] = [];
  showCreateModal = false;
  submitting = false;
  rating: number | null = null;

  private userService = inject(UserService);
  private answersMap = new Map<number, number[]>();

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.loadQuestions();
  }

  private loadQuestions(): void {
    this.questionService
      .getQuestionsByLesson(this.lessonId, 0, 20)
      .subscribe({
        next: (resp: QuestionsPublicResponse) => {
          this.questions = resp.questions;
          this.answersMap.clear();
          this.rating = null;
        },
        error: () => {
          // тут можно добавить уведомление об ошибке
        }
      });
  }

  private userSignal = this.userService.getUserSignal();
  isTeacher       = computed(() => this.userSignal()?.role === UserRole.TEACHER);


  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSave(newQuestion: CreateQuestionRequestDto): void {
    this.questionService
      .createQuestion(this.lessonId, newQuestion)
      .subscribe({
        next: q => {
          this.questions.push(q);
          this.showCreateModal = false;
        },
        error: () => {
          // уведомление об ошибке
        }
      });
  }

  onAnswerChange(qId: number, optId: number, checked: boolean, type: string) {
    let arr = this.answersMap.get(qId) || [];
    if (type === 'SINGLE_CHOICE') {
      arr = [optId];
    } else {
      if (checked) {
        arr = [...arr, optId];
      } else {
        arr = arr.filter(id => id !== optId);
      }
    }
    this.answersMap.set(qId, arr);
  }

  submitAnswers(): void {
    if (this.submitting) {
      return;
    }
    this.submitting = true;

    const payload: UserAnswerDto[] = [];
    this.answersMap.forEach((optIds, questionId) => {
      optIds.forEach(optId =>
        payload.push({ questionId, selectedOptionId: optId })
      );
    });

    this.questionService
      .checkAnswers(payload)
      .subscribe({
        next: (resp: CheckAnswersResponseDto) => {
          const correctCount = resp.results.filter(r => r.correct).length;
          this.rating = Math.round((correctCount / this.questions.length) * 100);
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
          // уведомление об ошибке
        }
      });
  }

  deleteQuestion(qId: number): void {
    this.questionService
      .deleteQuestion(qId)
      .subscribe(() => {
        this.questions = this.questions.filter(q => q.id !== qId);
      });
  }
}
