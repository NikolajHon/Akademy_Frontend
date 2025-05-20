import { Component, Input } from '@angular/core';
import { TestCaseResultDto } from '../../models/assignment.model';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-submission-result',
  templateUrl: './submission-result.component.html',
  styleUrls: ['./submission-result.component.scss'],
  imports: [
    NgForOf,
    NgIf
  ]
})
export class SubmissionResultComponent {
  @Input() results: TestCaseResultDto[] = [];
}
