import { Component } from '@angular/core';
import { Topic } from '../../models/topic.model';
import {Post} from '../../models/post.model';
import {PostService} from '../../services/post.service';
import {TopicFormComponent} from '../../components/topic-form/topic-form.component';
import {TopicListComponent} from '../../components/topic-list/topic-list.component';
import {PostFormComponent} from '../../components/post-form/post-form.component';
import {PostTreeComponent} from '../../components/post-tree/post-tree.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-forum-page',
  templateUrl: './forum-page.component.html',
  imports: [
    TopicFormComponent,
    TopicListComponent,
    PostFormComponent,
    PostTreeComponent,
    NgIf,
    NgForOf
  ]
})
export class ForumPageComponent {
  courseId = 1;              // можно взять из ActivatedRoute
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
