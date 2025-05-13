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

  /** GET /topics/{topicId}/posts (будут только root-посты) */
  getRootPosts(topicId: number): Observable<Post[]> {
    return this.http
      .get<{ posts: Post[] }>(`/topics/${topicId}/posts`)
      .pipe(map(r => r.posts));
  }

  /** GET /posts/{postId} (полное дерево) */
  getPostTree(postId: number): Observable<Post> {
    return this.http.get<Post>(`/posts/${postId}`);
  }

  /** POST /topics/{topicId}/posts */
  createPost(topicId: number, dto: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`/topics/${topicId}/posts`, dto);
  }

  /** POST /posts/{postId}/replies */
  reply(parentId: number, dto: CreateReplyRequest): Observable<Post> {
    return this.http.post<Post>(`/posts/${parentId}/replies`, dto);
  }

  /** PUT /posts/{id} */
  update(id: number, dto: UpdatePostRequest) {
    return this.http.put<Post>(`/posts/${id}`, dto);
  }
}
