import { Routes } from '@angular/router';
import { CourseListPageComponent } from './features/courses/pages/course-list-page/course-list-page.component';
import { CourseDetailPageComponent } from './features/courses/pages/course-detail-page/course-detail-page.component';
import {authGuard} from './core/guard/auth.guard';


export const routes: Routes = [
  {
    path: 'courses',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: CourseListPageComponent
      },
      {
        path: ':id',
        component: CourseDetailPageComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'courses'
  }
];
