import { Component, EventEmitter, Output } from '@angular/core';
import {CreateQuestionRequestDto, QuestionType} from '../../models/question.model';
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

  text: string = '';
  type: QuestionType = 'OPEN';
  options: Array<{ text: string; correct: boolean }> = [];
  singleCorrectIndex: number | null = null;
  answer: string = '';

  addOption() {
    this.options.push({ text: '', correct: false });
  }

  removeOption(i: number) {
    this.options.splice(i, 1);
    if (this.singleCorrectIndex !== null) {
      if (i < this.singleCorrectIndex) {
        this.singleCorrectIndex!--;
      } else if (i === this.singleCorrectIndex) {
        this.singleCorrectIndex = null;
      }
    }
  }

  get isSaveDisabled(): boolean {
    // 1) Вопрос без текста
    if (!this.text.trim()) {
      return true;
    }

    // 2) Open answer: нужен ответ
    if (this.type === 'OPEN') {
      return !this.answer.trim();
    }

    // 3) Для Choice-типа сначала нужен хотя бы один вариант
    if (this.options.length === 0) {
      return true;
    }
    // все варианты должны иметь непустой текст
    if (this.options.some(opt => !opt.text.trim())) {
      return true;
    }

    if (this.type === 'SINGLE_CHOICE') {
      // Single: обязательно выбрать ровно один
      return this.singleCorrectIndex === null;
    }

    if (this.type === 'MULTIPLE_CHOICE') {
      // Multiple: минимум один correct=true
      return !this.options.some(opt => opt.correct);
    }

    return true;
  }

  onSave() {
    // собираем options по DTO
    const opts = this.options.map((opt, i) => ({
      text: opt.text,
      correct:
        this.type === 'OPEN'
          ? true
          : this.type === 'SINGLE_CHOICE'
            ? i === this.singleCorrectIndex
            : opt.correct
    }));

    const dto: CreateQuestionRequestDto = {
      text: this.text,
      type: this.type,
      options: opts
    };
    this.save.emit(dto);
  }

  onClose() {
    this.close.emit();
  }
}
