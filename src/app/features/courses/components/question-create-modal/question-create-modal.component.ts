import { Component, EventEmitter, Output } from '@angular/core';
import { CreateQuestionRequestDto, QuestionType } from '../../models/question.model';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-question-create-modal',
  templateUrl: './question-create-modal.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./question-create-modal.component.scss']
})
export class QuestionCreateModalComponent {
  @Output() save  = new EventEmitter<CreateQuestionRequestDto>();
  @Output() close = new EventEmitter<void>();

  text = '';
  type: QuestionType = 'OPEN';
  options: Array<{ text: string; correct: boolean }> = [];

  addOption() {
    this.options.push({ text: '', correct: false });
  }

  removeOption(i: number) {
    this.options.splice(i, 1);
  }

  onSave() {
    const dto: CreateQuestionRequestDto = {
      text: this.text,
      type: this.type,
      options: this.type === 'OPEN' ? undefined : this.options
    };
    this.save.emit(dto);
  }

  onClose() {
    this.close.emit();
  }
}
