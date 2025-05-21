import { Component, Input } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-question-nav',
  templateUrl: './question-nav.component.html',
  styleUrls: ['./question-nav.component.css'],
  imports: [
    NgForOf
  ]
})
export class QuestionNavComponent {
  @Input() questions: unknown[] | null = [];

  scrollTo(index: number): void {
    const target = document.getElementById(`question-${index}`);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
