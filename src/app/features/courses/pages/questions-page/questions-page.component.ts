import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import {
  QuestionPublic,
  QuestionsPublicResponse,
  CreateQuestionRequestDto,
  UserAnswerDto,
  CheckAnswersResponseDto
} from '../../models/question.model';
import { QuestionsListComponent } from '../../components/questions-list/questions-list.component';
import { QuestionCreateModalComponent } from '../../components/question-create-modal/question-create-modal.component';
import { NgIf } from '@angular/common';
import { UserRole } from '../../../../core/models/user-role-enum';
import { UserService } from '../../../../core/services/user.service';
import { NotificationComponent } from '../../../../notification-component/notification.component';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-questions-page',
  standalone: true,
  imports: [
    QuestionsListComponent,
    QuestionCreateModalComponent,
    NgIf,
    NotificationComponent
  ],
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit {
  lessonId!: number;
  questions: QuestionPublic[] = [];
  showCreateModal = false;
  submitting = false;

  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private answersMap = new Map<number, number[]>();

  private userSignal = this.userService.getUserSignal();
  isTeacher = computed(() => this.userSignal()?.role === UserRole.TEACHER);

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.questionService
      .getQuestionsByLesson(this.lessonId, 0, 20)
      .subscribe({
        next: (resp: QuestionsPublicResponse) => {
          this.questions = resp.questions;
          this.answersMap.clear();
        },
        error: () => {
          this.toastService.error('Failed to load questions.', 'Error');
        }
      });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSave(newQuestion: CreateQuestionRequestDto): void {
    this.questionService.createQuestion(this.lessonId, newQuestion).subscribe({
      next: q => {
        this.questions.push(q);
        this.showCreateModal = false;
        this.toastService.success('Question created', 'Success');
      },
      error: () => {
        this.toastService.error('Failed to create question', 'Error');
      }
    });
  }

  onAnswerChange(qId: number, optId: number, checked: boolean, type: string): void {
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
      payload.push({ questionId, selectedOptionIds: optIds });
    });

    this.questionService.checkAnswers(payload).subscribe({
      next: (resp: CheckAnswersResponseDto) => {
        const correctCount = resp.results.filter(r => r.correct).length;
        const percent = Math.round((correctCount / this.questions.length) * 100);
        this.toastService.success(`You answered ${percent}% correctly`, 'Results');
        if (percent === 100) {
          const userId = this.userSignal()?.id as string;
          const courseId = Number(window.location.pathname.split('/')[2]);
          this.userService
            .setUserCourseRating(userId, courseId, { rating: 50 })
            .subscribe({
              next: () => this.toastService.success('Rating updated', 'Success'),
              error: () => this.toastService.error('Failed to update rating', 'Error')
            });
        }
        this.submitting = false;
      },
      error: () => {
        this.toastService.error('Failed to submit answers', 'Error');
        this.submitting = false;
      }
    });
  }

  deleteQuestion(qId: number): void {
    this.questionService.deleteQuestion(qId).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id !== qId);
        this.toastService.info('Question deleted', 'Info');
      },
      error: () => {
        this.toastService.error('Failed to delete question', 'Error');
      }
    });
  }
}
