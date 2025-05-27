import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionPublic } from '../../models/question.model';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent {
  @Input() questions: QuestionPublic[] = [];
  @Output() answerChange = new EventEmitter<{
    questionId: number;
    optionId: number;
    checked: boolean;
    type: string;
  }>();
  @Output() deleteQuestion = new EventEmitter<number>();

  isTeacher(): boolean {
    // заменить на реальную логику
    return false;
  }

  onOptionChanged(q: QuestionPublic, optId: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.answerChange.emit({
      questionId: q.id,
      optionId: optId,
      checked: input.checked,
      type: q.type
    });
  }

  onDelete(qId: number) {
    this.deleteQuestion.emit(qId);
  }
}
