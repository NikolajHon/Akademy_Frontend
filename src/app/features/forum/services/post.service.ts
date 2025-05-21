import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Post,
  CreatePostRequest,
  CreateReplyRequest,
  UpdatePostRequest,
} from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  getRootPosts(topicId: number): Observable<Post[]> {
    return this.http
      .get<{ posts: Post[] }>(`api/topics/${topicId}/posts`)
      .pipe(map(r => r.posts));
  }

  /** GET /posts/{postId} (полное дерево) */
  getPostTree(postId: number): Observable<Post> {
    return this.http.get<Post>(`api/posts/${postId}`);
  }

  /** POST /topics/{topicId}/posts */
  createPost(topicId: number, dto: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`api/topics/${topicId}/posts`, dto);
  }

  /** POST /posts/{postId}/replies */
  reply(parentId: number, dto: CreateReplyRequest): Observable<Post> {
    return this.http.post<Post>(`api/posts/${parentId}/replies`, dto);
  }

  /** PUT /posts/{id} */
  update(id: number, dto: UpdatePostRequest): Observable<Post> {
    return this.http.put<Post>(`api/posts/${id}`, dto);
  }

  /** DELETE /posts/{postId} */
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`api/posts/${postId}`);
  }
}
