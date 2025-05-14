import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostService } from '../../services/post.service';
import {UserService} from '../../../../core/services/user.service';
import {UserRole} from '../../../../core/models/user-role-enum';

@Component({
  selector: 'app-post-tree',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    DatePipe
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

  /** Публичный readonly-сигнал текущего пользователя */
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
    if (!this.replyText.trim()) return;
    this.postSrv
      .reply(this.post.id, { content: this.replyText })
      .subscribe(() => {
        this.replyText = '';
        this.replyFormVisible = false;
        this.replied.emit();
      });
  }

  deletePost(): void {
    this.postSrv.deletePost(this.post.id).subscribe(() => {
      this.replied.emit();
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
