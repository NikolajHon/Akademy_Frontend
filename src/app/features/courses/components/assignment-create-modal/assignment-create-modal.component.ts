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
      description: ['', Validators.required],
      teacherCode: ['', Validators.required],
      templateCode: ['', Validators.required],
      expectedOutput: ['', Validators.required],
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
      this.form.get('description')?.valid &&
      this.form.get('teacherCode')?.valid &&
      this.form.get('templateCode')?.valid &&
      this.form.get('expectedOutput')?.valid
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
        description:    this.form.value.description,
        teacherCode:    this.form.value.teacherCode,
        templateCode:   this.form.value.templateCode,
        expectedOutput: this.form.value.expectedOutput,
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
