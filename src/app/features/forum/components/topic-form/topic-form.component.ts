
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic.model';
import {ToastService} from '../../../courses/services/toast.service';
import {NotificationComponent} from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    NotificationComponent
  ]
})
export class TopicFormComponent implements OnInit {

  @Input() courseId!: number;
  @Output() created = new EventEmitter<Topic>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private srv: TopicService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.toast.error('Topic title cannot be empty', 'Validation Error');
      return;
    }

    this.srv.createTopic(this.courseId, this.form.value)
      .subscribe({
        next: topic => {
          this.form.reset();
          this.created.emit(topic);
          this.toast.success('Topic created successfully', 'Success');
        },
        error: () => {
          this.toast.error('Failed to create topic. Please try again.', 'Error');
        }
      });
  }
}
