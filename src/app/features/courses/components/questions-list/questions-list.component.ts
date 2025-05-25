import { Component, Input } from '@angular/core';
import { Question } from '../../models/question.model';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent {
  @Input() questions: Question[] = [];
}
