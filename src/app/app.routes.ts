import { Routes } from '@angular/router';
import { CourseListPageComponent } from './features/courses/pages/course-list-page/course-list-page.component';
import { CourseDetailPageComponent } from './features/courses/pages/course-detail-page/course-detail-page.component';
import {canActiveHome} from './core/services/user.service';
import {HomeComponent} from './features/home/home.component';


export const routes: Routes = [
  {path: 'course-page', component: CourseListPageComponent, canActivate: [canActiveHome]},
  {path: 'course-page/:id', component: CourseDetailPageComponent, canActivate: [canActiveHome]},
  {
    path: '',
    redirectTo: 'course-page',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'course-page'
  }
];
