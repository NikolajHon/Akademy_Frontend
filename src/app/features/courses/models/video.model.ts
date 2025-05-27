// src/app/models/video.model.ts

/** Полная модель видео-материала, приходит с бэка */
export interface VideoMaterial {
  id: number;
  title: string;
  url: string;
  // именно так прокидываем lessonId из VideoMaterialDto
  lessonId: number;
}

/** DTO для создания нового видео */
export interface CreateVideoMaterialRequest {
  title: string;
  url: string;
}
