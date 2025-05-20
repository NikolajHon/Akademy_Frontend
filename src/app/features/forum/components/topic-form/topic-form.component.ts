import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic.model';

@Component({
  selector: 'app-topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.scss'],
  imports: [
    ReactiveFormsModule
  ]
})
export class TopicFormComponent implements OnInit {

  @Input()  courseId!: number;
  @Output() created  = new EventEmitter<Topic>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private srv: TopicService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) { return; }

    this.srv.createTopic(this.courseId, this.form.value as any)
      .subscribe(topic => {
        this.form.reset();
        this.created.emit(topic);
      });
  }
}
