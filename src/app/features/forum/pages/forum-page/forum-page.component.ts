import { Component } from '@angular/core';
import { Topic } from '../../models/topic.model';
import {Post} from '../../models/post.model';
import {PostService} from '../../services/post.service';
import {TopicFormComponent} from '../../components/topic-form/topic-form.component';
import {TopicListComponent} from '../../components/topic-list/topic-list.component';
import {PostFormComponent} from '../../components/post-form/post-form.component';
import {PostTreeComponent} from '../../components/post-tree/post-tree.component';
import {NgForOf, NgIf} from '@angular/common';
import {NotificationComponent} from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-forum-page',
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.scss'],
  imports: [
    TopicFormComponent,
    TopicListComponent,
    PostFormComponent,
    PostTreeComponent,
    NgIf,
    NgForOf,
    NotificationComponent
  ]
})
export class ForumPageComponent {
  courseId = 1;
  selectedTopic?: Topic;
  rootPosts: Post[] = [];
  loadingPosts = false;

  constructor(private postSrv: PostService) {}

  onTopicSelected(t: Topic) {
    this.selectedTopic = t;
    this.loadPosts();
  }

  loadPosts() {
    if (!this.selectedTopic) return;
    this.loadingPosts = true;
    this.postSrv.getRootPosts(this.selectedTopic.id).subscribe({
      next: list => {
        this.rootPosts = list;
        this.loadingPosts = false;
      },
      error: () => (this.loadingPosts = false),
    });
  }
}
