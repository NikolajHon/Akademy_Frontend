import { TopicStatus } from './topic-status.enum';

export interface Topic {
  id:             number;
  title:          string;
  courseId:       number;
  lessonId?:      number | null;
  status:         TopicStatus;
  createdAt:      string;            // ISO-дата
  createdById:    number;
  postsCount?:    number | null;
  lastActivityAt: string;
}
export interface CreateTopicRequest {
  title:    string;
  lessonId?: number | null;
}


export interface UpdateTopicRequest extends CreateTopicRequest {
  id:     number;
  status: TopicStatus;
}
