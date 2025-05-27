import { Component, EventEmitter, Output } from '@angular/core'
import { CreateQuestionRequestDto, QuestionType } from '../../models/question.model'
import { FormsModule } from '@angular/forms'
import { NgForOf, NgIf } from '@angular/common'

@Component({
  selector: 'app-question-create-modal',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './question-create-modal.component.html',
  styleUrls: ['./question-create-modal.component.scss']
})
export class QuestionCreateModalComponent {
  @Output() save = new EventEmitter<CreateQuestionRequestDto>()
  @Output() close = new EventEmitter<void>()

  text = ''
  type: QuestionType = 'SINGLE_CHOICE'
  options: Array<{ text: string; correct: boolean }> = []
  singleCorrectIndex: number | null = null

  addOption() {
    this.options.push({ text: '', correct: false })
  }

  removeOption(i: number) {
    this.options.splice(i, 1)
    if (this.singleCorrectIndex !== null) {
      if (i < this.singleCorrectIndex) {
        this.singleCorrectIndex!--
      } else if (i === this.singleCorrectIndex) {
        this.singleCorrectIndex = null
      }
    }
  }

  get isSaveDisabled(): boolean {
    if (!this.text.trim()) return true
    if (this.options.length === 0 || this.options.some(o => !o.text.trim())) return true
    if (this.type === 'SINGLE_CHOICE') return this.singleCorrectIndex === null
    if (this.type === 'MULTIPLE_CHOICE') return !this.options.some(o => o.correct)
    return true
  }

  onSave() {
    const opts = this.options.map((opt, i) => ({
      text: opt.text.trim(),
      correct:
        this.type === 'SINGLE_CHOICE'
          ? i === this.singleCorrectIndex
          : opt.correct
    }))

    const payload: CreateQuestionRequestDto = {
      text: this.text.trim(),
      type: this.type,
      options: opts
    }

    console.log('CreateQuestion payload:', JSON.stringify(payload))
    this.save.emit(payload)
  }

  onClose() {
    this.close.emit()
  }
}
