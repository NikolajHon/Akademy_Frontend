import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import {CourseProgressWithUserDto, UserDto} from '../../../../core/models/user-model';


@Component({
  selector: 'app-top-five-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-five-list.component.html',
  styleUrls: ['./top-five-list.component.scss']
})
export class TopFiveListComponent implements OnChanges {
  @Input() courseId!: number;

  users: CourseProgressWithUserDto[] = [];

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['courseId'] &&
      typeof this.courseId === 'number' &&
      !isNaN(this.courseId)
    ) {
      this.loadTopFive();
    }
  }

  private loadTopFive() {
    this.userService
      .listCourseProgressByCourse(this.courseId)
      .subscribe(list => {
        this.users = list
          .filter(cp => cp.user.role === 'Student')
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
      });
  }

  getAvatarUrl(user: UserDto): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.givingName + ' ' + user.familyName
    )}&background=random`;
  }
}
