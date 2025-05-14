import { PostStatus } from './post-status.enum';

export interface Post {
  id:         number;
  topicId:    number;
  parentId?:  number | null;
  authorName: string;
  content:    string;
  createdAt:  string;
  updatedAt?: string | null;
  status:     PostStatus;
  replies?:   Post[];
}
export interface CreatePostRequest {
  content: string;
}
export interface CreateReplyRequest {
  content: string;
}
export interface UpdatePostRequest {
  id:      number;
  content: string;
}
