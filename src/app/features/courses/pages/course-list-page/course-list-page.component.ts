import {
  Component, OnInit,
  WritableSignal, signal, computed, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

import { CourseListComponent } from
    '../../components/course-list/course-list.component';

@Component({
  selector: 'app-course-list-page',
  standalone: true,
  imports: [CommonModule, CourseListComponent],
  templateUrl: './course-list-page.component.html',
  styleUrls: ['./course-list-page.component.scss']
})
export class CourseListPageComponent implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);

  private coursesSig: WritableSignal<Course[]> = signal([]);

  private searchQuery: WritableSignal<string> = signal('');

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return !q
      ? this.coursesSig()
      : this.coursesSig().filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
  });

  ngOnInit() {
    this.courseService.getCourses()
      .subscribe(list => this.coursesSig.set(list));
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  openCourse(id: number): void {
    this.router.navigate(['/course-page', id]);
  }
}
