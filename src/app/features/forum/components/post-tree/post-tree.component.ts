// src/app/posts/post-tree.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostService } from '../../services/post.service';
import { UserService } from '../../../../core/services/user.service';
import { UserRole } from '../../../../core/models/user-role-enum';
import {ToastService} from '../../../courses/services/toast.service';
import {NotificationComponent} from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-post-tree',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    DatePipe,
    NotificationComponent
  ],
  templateUrl: './post-tree.component.html',
  styleUrls: ['./post-tree.component.scss']
})
export class PostTreeComponent {
  @Input() post!: {
    id: number;
    authorName: string;
    content: string;
    createdAt: string;
    replies?: any[];
  };
  @Input() topicId!: number;
  @Output() replied = new EventEmitter<void>();

  private postSrv = inject(PostService);
  private userSrv = inject(UserService);
  private toast = inject(ToastService);

  userSignal = this.userSrv.getUserSignal();

  replyFormVisible = false;
  replyText = '';

  repliesVisible = false;
  displayCount = 0;
  pageSize = 3;

  toggleReply(): void {
    this.replyFormVisible = !this.replyFormVisible;
  }

  sendReply(): void {
    if (!this.replyText.trim()) {
      this.toast.error('Reply content cannot be empty', 'Validation Error');
      return;
    }
    this.postSrv
      .reply(this.post.id, { content: this.replyText })
      .subscribe({
        next: () => {
          this.replyText = '';
          this.replyFormVisible = false;
          this.toast.success('Reply posted successfully', 'Success');
          this.replied.emit();
        },
        error: () => {
          this.toast.error('Failed to post reply. Please try again.', 'Error');
        }
      });
  }

  deletePost(): void {
    this.postSrv.deletePost(this.post.id).subscribe({
      next: () => {
        this.toast.success('Post deleted successfully', 'Success');
        this.replied.emit();
      },
      error: () => {
        this.toast.error('Failed to delete post. Please try again.', 'Error');
      }
    });
  }

  toggleReplies(): void {
    this.repliesVisible = !this.repliesVisible;
    if (this.repliesVisible && this.displayCount === 0) {
      this.displayCount = this.pageSize;
    }
    if (!this.repliesVisible) {
      this.displayCount = 0;
    }
  }

  showMore(): void {
    if (this.post.replies) {
      this.displayCount = Math.min(
        this.post.replies.length,
        this.displayCount + this.pageSize
      );
    }
  }

  get visibleReplies(): any[] {
    return (this.post.replies || []).slice(0, this.displayCount);
  }

  get canDelete(): boolean {
    const u = this.userSignal();
    if (!u) return false;
    return u.name === this.post.authorName || u.role === UserRole.TEACHER;
  }
}
