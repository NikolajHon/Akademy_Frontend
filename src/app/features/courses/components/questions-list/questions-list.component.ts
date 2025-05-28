import {Component, Input, Output, EventEmitter, inject, signal, computed} from '@angular/core';
import { QuestionPublic } from '../../models/question.model';
import {NgForOf, NgIf} from '@angular/common';
import {UserService} from '../../../../core/services/user.service';
import {Router} from '@angular/router';
import {Course} from '../../models/course.model';
import {UserDto} from '../../../../core/models/user-model';
import {UserRole} from '../../../../core/models/user-role-enum';

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

  private userService = inject(UserService);
   private userSignal = this.userService.getUserSignal();
  isTeacher       = computed(() => this.userSignal()?.role === UserRole.TEACHER);


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
