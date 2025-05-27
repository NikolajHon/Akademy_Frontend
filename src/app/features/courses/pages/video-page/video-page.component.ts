import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgForOf, NgIf } from '@angular/common';
import { CreateVideoMaterialRequest, VideoMaterial } from '../../models/video.model';
import { VideoMaterialService } from '../../services/video.service';
import { ToastService } from '../../services/toast.service';
import { NotificationComponent } from '../../../../notification-component/notification.component';

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.scss'],
  standalone: true,
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
  safeUrls: Record<number, SafeResourceUrl> = {};

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoMaterialService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.form = this.fb.group({
      title: ['', Validators.required],
      url: ['', Validators.required]
    });
    this.loadVideos();
  }

  loadVideos(): void {
    this.loading = true;
    this.error = null;
    this.videoService.getByLesson(this.lessonId).subscribe({
      next: videos => {
        this.videoMaterials = videos;
        this.buildSafeUrls();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load videos';
        this.loading = false;
      }
    });
  }

  openModal(): void {
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const dto = this.form.value as CreateVideoMaterialRequest;

    this.videoService.create(this.lessonId, dto).subscribe({
      next: () => {
        this.toast.success('Video added');
        this.closeModal();
        this.videoService.getByLesson(this.lessonId).subscribe(
          videos => {
            this.videoMaterials = videos;
            this.buildSafeUrls();
          },
          () => this.toast.error('Failed to refresh video list')
        );
      },
      error: () => this.toast.error('Failed to add video')
    });
  }

  onDelete(vm: VideoMaterial): void {
    this.videoService.delete(this.lessonId, vm.id).subscribe({
      next: () => {
        this.videoMaterials = this.videoMaterials.filter(x => x.id !== vm.id);
        delete this.safeUrls[vm.id];
        this.toast.info('Video removed');
      },
      error: () => this.toast.error('Failed to remove video')
    });
  }

  private buildSafeUrls(): void {
    this.safeUrls = {};
    this.videoMaterials.forEach(vm => {
      if (this.isYouTube(vm.url)) {
        const embedUrl = this.toYouTubeEmbed(vm.url);
        this.safeUrls[vm.id] = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    });
  }

  isYouTube(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url);
  }

  toYouTubeEmbed(url: string): string {
    let videoId: string | null;
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
    } else {
      videoId = new URL(url).searchParams.get('v');
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
