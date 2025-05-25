import { Component, OnInit } from '@angular/core';
import { Question, CreateQuestionRequestDto } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
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
  lessonId = 1;
  page = 0;
  size = 20;
  questions: Question[] = [];
  showCreateModal = false;

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService
      .getQuestionsByLesson(this.lessonId, this.page, this.size)
      .subscribe(res => this.questions = res.questions);
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  onSave(dto: CreateQuestionRequestDto) {
    this.questionService
      .createQuestion(this.lessonId, dto)
      .subscribe(q => {
        this.questions.push(q);
        this.showCreateModal = false;
      });
  }

  isTeacher(): boolean {
    return true;
  }
}
