import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Topic} from '../../models/topic.model';
import { BehaviorSubject } from "rxjs";
import {TopicService} from '../../services/topic.service';
import {AsyncPipe, NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
  imports: [
    NgClass,
    NgForOf,
    AsyncPipe
  ]
})
export class TopicListComponent implements OnInit {
  @Input() courseId!: number;
  @Output() select = new EventEmitter<Topic>();

  topics$ = new BehaviorSubject<Topic[]>([]);
  loading = false;

  constructor(private topicSrv: TopicService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.topicSrv.getTopics(this.courseId).subscribe({
      next: list => {
        this.topics$.next(list);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
