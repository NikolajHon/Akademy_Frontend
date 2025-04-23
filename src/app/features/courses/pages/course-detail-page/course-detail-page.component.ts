import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LessonsListComponent} from '../../components/lessons-list/lessons-list.component';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/course.model';
import {Lesson} from '../../models/lesson.model';
import {TopFiveListComponent} from '../../components/top-five-list/top-five-list.component';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports:
    [CommonModule, LessonsListComponent, TopFiveListComponent],
  templateUrl:
    `./course-detail-page.component.html`,
})
export class CourseDetailPageComponent {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  course: Course | null = null;

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getCourses().subscribe(courses => {
      this.course = courses.find(c => c.id === courseId) || null;
    });
  }


  onGoToLesson(lesson: Lesson) {
    console.log('go to lesson', lesson);
  }

  onViewTasks(lesson: Lesson) {
    console.log('view tasks for', lesson);
  }

  onStartPractice(lesson: Lesson) {
    console.log('start practice for', lesson);
  }

  onViewQuestions(lesson: Lesson) {
    console.log('view questions for', lesson);
  }
}
