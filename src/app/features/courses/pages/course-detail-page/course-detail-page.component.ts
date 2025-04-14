import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./course-detail-page.component.html`,
})
export class CourseDetailPageComponent {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  course: Course | null = null;

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Открыт маршрут с courseId =', courseId);

    this.courseService.getCourses().subscribe(courses => {
      console.log('Доступные курсы в detail page:', courses);
      this.course = courses.find(c => c.id === courseId) || null;
    });
  }

}
