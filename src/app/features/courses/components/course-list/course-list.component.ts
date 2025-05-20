import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Course} from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseListComponent {
  @Input() courses: Course[] = [];
  @Output() select = new EventEmitter<number>();

  openCourse(course: Course) {
    this.select.emit(course.id);
  }
}
