// src/app/question/questions-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import {
  Question,
  CreateQuestionRequestDto,
  RatingDto
} from '../../models/question.model';
import { UserModel } from '../../../../core/models/user-model';
import { UserService } from '../../../../core/services/user.service';
import { UserRole } from '../../../../core/models/user-role-enum';
import { QuestionCreateModalComponent } from '../../components/question-create-modal/question-create-modal.component';
import { QuestionsListComponent } from '../../components/questions-list/questions-list.component';
import { NgIf } from '@angular/common';
import {ToastService} from '../../services/toast.service';
import {NotificationComponent} from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss'],
  imports: [
    QuestionCreateModalComponent,
    QuestionsListComponent,
    NgIf,
    NotificationComponent
  ]
})
export class QuestionsPageComponent implements OnInit {
  lessonId!: number;
  questions: Question[] = [];
  singleAnswers: Record<number, number> = {};
  multiAnswers: Record<number, number[]> = {};
  openAnswers: Record<number, string> = {};
  showCreateModal = false;
  submitting = false;
  rating: number | null = null;
  currentUser?: UserModel;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private userService: UserService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.currentUser = this.userService.getUserSignal()!();
    this.loadQuestions();
  }

  private loadQuestions(): void {
    this.questionService
      .getQuestionsByLesson(this.lessonId, 0, 20)
      .subscribe(res => {
        this.questions = res.questions;
      }, () => {
        this.toast.error('Failed to load questions', 'Error');
      });
  }

  isTeacher(): boolean {
    return this.currentUser?.role === UserRole.TEACHER;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSave(dto: CreateQuestionRequestDto): void {
    this.questionService
      .createQuestion(this.lessonId, dto)
      .subscribe({
        next: q => {
          this.questions.push(q);
          this.showCreateModal = false;
          this.toast.success('Question created successfully', 'Success');
        },
        error: () => {
          this.toast.error('Could not create question', 'Error');
        }
      });
  }

  onCheckboxChange(qId: number, oId: number, checked: boolean): void {
    const arr = this.multiAnswers[qId] ||= [];
    if (checked) {
      arr.push(oId);
    } else {
      this.multiAnswers[qId] = arr.filter(x => x !== oId);
    }
  }

  submitAnswers(): void {
    if (this.submitting) {
      return;
    }
    this.submitting = true;

    let correct = 0;
    for (const q of this.questions) {
      if (q.type === 'OPEN') {
        if ((this.openAnswers[q.id] || '').trim()) {
          correct++;
        }
      }
      if (q.type === 'SINGLE_CHOICE') {
        const selected = this.singleAnswers[q.id];
        const right = q.options.find(o => o.isCorrect)?.id;
        if (selected === right) {
          correct++;
        }
      }
      if (q.type === 'MULTIPLE_CHOICE') {
        const selected = this.multiAnswers[q.id] || [];
        const rightIds = q.options.filter(o => o.isCorrect).map(o => o.id);
        if (
          selected.length === rightIds.length &&
          selected.every(i => rightIds.includes(i))
        ) {
          correct++;
        }
      }
    }

    this.rating = Math.round((correct / this.questions.length) * 100);
    const dto: RatingDto = { rating: this.rating };
    const userId = this.currentUser!.id;

    this.userService
      .setUserCourseRating(userId, this.lessonId, dto)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.toast.success(`Your score: ${this.rating}%`, 'Quiz Submitted');
        },
        error: () => {
          this.submitting = false;
          this.toast.error('Failed to submit your answers', 'Error');
        }
      });
  }
}
