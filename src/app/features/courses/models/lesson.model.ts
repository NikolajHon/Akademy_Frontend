
export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  courseId: number;
}

export interface CreateLessonRequestDto {
  title: string;
  description: string;
  content: string;
  courseId: number;
}
