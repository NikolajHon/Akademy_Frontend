import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import {
  Question,
  CreateQuestionRequestDto,
  RatingDto
} from '../../models/question.model';
import {UserModel} from '../../../../core/models/user-model';
import {UserService} from '../../../../core/services/user.service';
import {UserRole} from '../../../../core/models/user-role-enum';
import {QuestionCreateModalComponent} from '../../components/question-create-modal/question-create-modal.component';
import {QuestionsListComponent} from '../../components/questions-list/questions-list.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  imports: [
    QuestionCreateModalComponent,
    QuestionsListComponent,
    NgIf
  ],
  styleUrls: ['./questions-page.component.scss']
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
    private qs: QuestionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // 1) Получаем lessonId из URL
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));

    // 2) Снимаем текущего пользователя из сигнала (UserService хранит UserModel в signal)
    this.currentUser = this.userService.getUserSignal()!();

    // 3) Подгружаем вопросы
    this.qs.getQuestionsByLesson(this.lessonId, 0, 20)
      .subscribe(res => this.questions = res.questions);
  }

  // проверяем, что у нас учитель
  isTeacher(): boolean {
    return this.currentUser?.role === UserRole.TEACHER;
  }

  // открыть/закрыть форму создания
  openCreateModal() { this.showCreateModal = true; }
  closeCreateModal() { this.showCreateModal = false; }

  // после сохранения нового вопроса — добавить его в список
  onSave(dto: CreateQuestionRequestDto) {
    this.qs.createQuestion(this.lessonId, dto)
      .subscribe(q => {
        this.questions.push(q);
        this.showCreateModal = false;
      });
  }

  // чекбокс-мультивыбор
  onCheckboxChange(qId: number, oId: number, checked: boolean) {
    const arr = this.multiAnswers[qId] ||= [];
    if (checked) arr.push(oId);
    else       this.multiAnswers[qId] = arr.filter(x => x !== oId);
  }

  // проверка ответов и отправка рейтинга
  submitAnswers() {
    if (this.submitting) return;
    this.submitting = true;

    let correct = 0;
    for (const q of this.questions) {
      if (q.type === 'OPEN') {
        if ((this.openAnswers[q.id] || '').trim()) correct++;
      }
      if (q.type === 'SINGLE_CHOICE') {
        const sel = this.singleAnswers[q.id];
        const right = q.options.find(o => o.isCorrect)?.id;
        if (sel === right) correct++;
      }
      if (q.type === 'MULTIPLE_CHOICE') {
        const sel = this.multiAnswers[q.id] || [];
        const rightIds = q.options.filter(o => o.isCorrect).map(o => o.id);
        if (
          sel.length === rightIds.length &&
          sel.every(i => rightIds.includes(i))
        ) correct++;
      }
    }

    this.rating = Math.round((correct / this.questions.length) * 100);
    const dto: RatingDto = { rating: this.rating };
    const userId = this.currentUser!.id;

    this.userService.setUserCourseRating(userId, this.lessonId, dto)
      .subscribe({
        next: () => this.submitting = false,
        error: () => this.submitting = false
      });
  }
}
