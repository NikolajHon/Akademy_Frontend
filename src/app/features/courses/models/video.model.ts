export interface VideoMaterial {
  id: number;
  title: string;
  url: string;
  lessonId: number;
}

export interface CreateVideoMaterialRequest {
  title: string;
  url: string;
}
