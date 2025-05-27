// src/app/services/video-material.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateVideoMaterialRequest, VideoMaterial } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class VideoMaterialService {
  // Если у вас прокси (proxy.conf.json) перенаправляет /api → Spring Boot,
  // то baseUrl = '/api/video' — всё верно.
  // Иначе: baseUrl = '/video'
  private baseUrl = '/api/video';

  constructor(private http: HttpClient) { }

  /** GET /api/video/{lessonId}/video-materials */
  getByLesson(lessonId: number): Observable<VideoMaterial[]> {
    return this.http.get<VideoMaterial[]>(
      `${this.baseUrl}/${lessonId}/video-materials`
    );
  }

  /** POST /api/video/{lessonId}/video-materials */
  create(
    lessonId: number,
    dto: CreateVideoMaterialRequest
  ): Observable<VideoMaterial> {
    return this.http.post<VideoMaterial>(
      `${this.baseUrl}/${lessonId}/video-materials`,
      dto
    );
  }

  /** DELETE /api/video/{lessonId}/video-materials/{videoMaterialId} */
  delete(
    lessonId: number,
    videoMaterialId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${lessonId}/video-materials/${videoMaterialId}`
    );
  }
}
