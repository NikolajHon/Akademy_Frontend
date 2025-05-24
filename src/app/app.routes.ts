import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { CourseListPageComponent } from './features/courses/pages/course-list-page/course-list-page.component';
import { CourseDetailPageComponent } from './features/courses/pages/course-detail-page/course-detail-page.component';
import { ForumPageComponent } from './features/forum/pages/forum-page/forum-page.component';
import { AssignmentPageComponent } from './features/courses/pages/assignment-page/assignment-page.component';
import { RegisterComponent } from './register/register.component';
import { QuestionsPageComponent } from './features/courses/pages/questions-page/questions-page.component';
import { VideoPageComponent } from './features/courses/pages/video-page/video-page.component';  // <-- ваш компонент
import { canActiveHome } from './core/services/user.service';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  {
    path: 'course-page',
    component: CourseListPageComponent,
    canActivate: [canActiveHome]
  },
  {
    path: 'course-page/:id',
    component: CourseDetailPageComponent,
    canActivate: [canActiveHome]
  },
  {
    path: 'forum',
    component: ForumPageComponent,
    canActivate: [canActiveHome]
  },
  {
    path: 'course-page/:id/assignment/:assignmentId',
    component: AssignmentPageComponent,
    canActivate: [canActiveHome]
  },
  {
    path: 'course-page/:lessonId/questions',
    component: QuestionsPageComponent,
    canActivate: [canActiveHome]
  },

  {
    path: 'course-page/:lessonId/video',
    component: VideoPageComponent,
    canActivate: [canActiveHome]
  },

  { path: 'test', component: RegisterComponent, canActivate: [canActiveHome] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
