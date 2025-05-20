import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TopUser {
  name: string;
  score: number;
  avatarUrl: string;
}

@Component({
  selector: 'app-top-five-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-five-list.component.html',
  styleUrls: ['./top-five-list.component.scss']
})
export class TopFiveListComponent {
  users: TopUser[] = Array.from({ length: 5 }, (_, i) => ({
    name: `User ${i + 1}`,
    score: 1000 - i * 100,
    avatarUrl: `https://i.pravatar.cc/150?img=${10 + i}`
  }));
}
