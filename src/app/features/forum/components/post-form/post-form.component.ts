import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PostService} from '../../services/post.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  imports: [
    FormsModule
  ]
})
export class PostFormComponent {
  @Input() topicId!: number;
  @Output() created = new EventEmitter<void>();

  text = '';

  constructor(private srv: PostService) {}

  send() {
    if (!this.text.trim()) return;
    this.srv.createPost(this.topicId, { content: this.text }).subscribe(() => {
      this.text = '';
      this.created.emit();
    });
  }
}
