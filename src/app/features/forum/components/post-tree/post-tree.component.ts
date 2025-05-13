import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Post } from '../../models/post.model';
import {PostService} from '../../services/post.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-post-tree',
  templateUrl: './post-tree.component.html',
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    DatePipe
  ]
})
export class PostTreeComponent {
  @Input() post!: Post;
  @Input() topicId!: number;
  @Output() replied = new EventEmitter<void>();

  replyFormVisible = false;
  replyText = '';

  constructor(private srv: PostService) {}

  toggleReply() {
    this.replyFormVisible = !this.replyFormVisible;
  }

  sendReply() {
    if (!this.replyText.trim()) return;
    this.srv
      .reply(this.post.id!, { content: this.replyText })
      .subscribe(() => {
        this.replyText = '';
        this.replyFormVisible = false;
        this.replied.emit();
      });
  }
}
