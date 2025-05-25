// src/app/posts/post-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FormsModule } from '@angular/forms';
import {ToastService} from '../../../courses/services/toast.service';
import {NotificationComponent} from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  imports: [
    FormsModule,
    NotificationComponent
  ]
})
export class PostFormComponent {
  @Input() topicId!: number;
  @Output() created = new EventEmitter<void>();

  text = '';

  constructor(
    private srv: PostService,
    private toast: ToastService
  ) {}

  send(): void {
    if (!this.text.trim()) {
      this.toast.error('Post content cannot be empty', 'Validation Error');
      return;
    }

    this.srv.createPost(this.topicId, { content: this.text }).subscribe({
      next: () => {
        this.text = '';
        this.created.emit();
        this.toast.success('Your post has been created!', 'Success');
      },
      error: () => {
        this.toast.error('Failed to create post. Please try again.', 'Error');
      }
    });
  }
}
