import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { CourseListPageComponent } from './features/courses/pages/course-list-page/course-list-page.component';
import { CourseDetailPageComponent } from './features/courses/pages/course-detail-page/course-detail-page.component';
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

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: '**', redirectTo: 'home' }
];

