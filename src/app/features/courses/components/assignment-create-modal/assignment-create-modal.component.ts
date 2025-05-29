import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { CreateAssignmentRequestDto } from '../../models/assignment.model';

@Component({
  selector: 'app-assignment-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assignment-create-modal.component.html',
  styleUrls: ['./assignment-create-modal.component.scss']
})
export class AssignmentCreateModalComponent implements OnInit {
  @Input() lessonId!: number;
  @Input() show = false;
  @Input() close!: () => void;

  step = 1;
  form!: FormGroup;
  outputTypes = [
    { value: 'INT', label: 'Integer' },
    { value: 'STRING', label: 'String' }
  ];

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],       // added title control
      description: ['', Validators.required],
      teacherCode: ['', Validators.required],
      templateCode: ['', Validators.required],
      language: ['', Validators.required],    // still in form but stepped to step 2
      outputType: ['', Validators.required],
      testCases: this.fb.array([])
    });
    this.addTestCase();
  }

  get testCases(): FormArray {
    return this.form.get('testCases') as FormArray;
  }

  addTestCase(): void {
    this.testCases.push(
      this.fb.group({
        input: ['', Validators.required],
        expectedOutput: ['', Validators.required]
      })
    );
  }

  removeTestCase(index: number): void {
    this.testCases.removeAt(index);
  }

  next(): void {
    if (
      this.form.get('title')?.valid &&           // check title
      this.form.get('description')?.valid &&
      this.form.get('teacherCode')?.valid &&
      this.form.get('templateCode')?.valid
    ) {
      this.step = 2;
    } else {
      this.form.markAllAsTouched();
    }
  }

  back(): void {
    this.step = 1;
  }

  submit(): void {
    if (this.form.valid) {
      const payload: CreateAssignmentRequestDto = {
        title:          this.form.value.title,
        description:    this.form.value.description,
        teacherCode:    this.form.value.teacherCode,
        templateCode:   this.form.value.templateCode,
        language:       this.form.value.language,
        outputType:     this.form.value.outputType,
        testCases:      this.form.value.testCases
      };

      this.assignmentService
        .createAssignment(this.lessonId, payload)
        .subscribe({
          next: () => this.close(),
          error: (err) => console.error('Create assignment failed', err)
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
