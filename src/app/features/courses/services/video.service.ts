import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CreateVideoMaterialRequest, VideoMaterial} from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class VideoMaterialService {
  private baseUrl = '/api/video';

  constructor(private http: HttpClient) { }

  getByLesson(lessonId: number): Observable<VideoMaterial[]> {
    return this.http.get<VideoMaterial[]>(
      `${this.baseUrl}/${lessonId}/video-materials`
    );
  }

  create(lessonId: number, dto: CreateVideoMaterialRequest): Observable<VideoMaterial> {
    return this.http.post<VideoMaterial>(
      `${this.baseUrl}/${lessonId}/video-materials`,
      dto
    );
  }

  delete(lessonId: number, videoMaterialId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${lessonId}/video-materials/${videoMaterialId}`
    );
  }
}
