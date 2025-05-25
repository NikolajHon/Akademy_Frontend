import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoMaterialService } from '../../services/video.service';
import { CreateVideoMaterialRequest, VideoMaterial } from '../../models/video.model';
import { NgForOf, NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {NotificationComponent} from '../../../../notification-component/notification.component';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NotificationComponent
  ]
})
export class VideoPageComponent implements OnInit {
  lessonId!: number;
  videoMaterials: VideoMaterial[] = [];
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  modalOpen = false;

  safeUrls: { [id: number]: SafeResourceUrl } = {};

  constructor(
    private route: ActivatedRoute,
    private svc: VideoMaterialService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.form = this.fb.group({
      title: ['', Validators.required],
      url:   ['', [Validators.required]]
    });
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.error = null;
    this.svc.getByLesson(this.lessonId).subscribe({
      next: list => {
        this.videoMaterials = list;
        this.prepareSafeUrls();
        this.loading = false;
      },
      error: _ => {
        this.error = 'Не удалось загрузить видео';
        this.loading = false;
      }
    });
  }

  // Открыть модалку
  openModal(): void {
    console.log("we are open our modal")
    this.modalOpen = true;
  }

  // Закрыть модалку
  closeModal(): void {
    this.modalOpen = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const dto: CreateVideoMaterialRequest = this.form.value;
    this.svc.create(this.lessonId, dto).subscribe({
      next: vm => {
        this.toast.success('Video successfully added', 'Success');
        this.videoMaterials.push(vm);
        if (this.isYouTube(vm.url)) {
          const embed = this.toYouTubeEmbed(vm.url);
          this.safeUrls[vm.id] = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
        }
        this.closeModal();
      },
      error: err => {
        this.toast.error('Failed to add video', 'Error');
        console.error(err);
      }
    });
  }

  onDelete(vm: VideoMaterial): void {
    if (!confirm(`Удалить "${vm.title}"?`)) return;
    this.svc.delete(this.lessonId, vm.id).subscribe({
      next: () => {
        this.videoMaterials = this.videoMaterials.filter(x => x.id !== vm.id);
        this.toast.info('Video deleted', 'Information');
      },
      error: () => {
        this.toast.error('Failed to delete the video', 'Error');
      }
    });
  }

  private prepareSafeUrls(): void {
    this.safeUrls = {};
    this.videoMaterials.forEach(vm => {
      if (this.isYouTube(vm.url)) {
        const embed = this.toYouTubeEmbed(vm.url);
        this.safeUrls[vm.id] = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
      }
    });
  }

  isYouTube(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url);
  }

  toYouTubeEmbed(url: string): string {
    let videoId: string|null = null;
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
    } else {
      videoId = new URL(url).searchParams.get('v');
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
