// questions-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgSwitch,
    NgSwitchCase
  ],
  styleUrls: ['./questions-page.component.scss']
})
export class QuestionsPageComponent implements OnInit {
  lessonId!: number;
  questions: Question[] = [];

  // здесь храним ответы пользователя
  singleAnswers: { [questionId: number]: number } = {};
  multiAnswers: { [questionId: number]: number[] } = {};
  openAnswers: { [questionId: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private qs: QuestionService
  ) {}

  ngOnInit(): void {
    this.lessonId = +this.route.snapshot.paramMap.get('lessonId')!;
    this.loadQuestions();
  }

  loadQuestions() {
    this.qs.getQuestionsByLesson(this.lessonId, 0, 20)
      .subscribe(resp => this.questions = resp.questions);
  }

  onCheckboxChange(questionId: number, optionId: number, checked: boolean) {
    const arr = this.multiAnswers[questionId] ||= [];
    if (checked) {
      arr.push(optionId);
    } else {
      this.multiAnswers[questionId] = arr.filter(id => id !== optionId);
    }
  }
}
