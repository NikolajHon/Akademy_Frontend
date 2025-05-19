import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  /** Шаблон кода, который «печатается» */
  private readonly codeLines: string[] = [
    'function helloWorld() {',
    '  console.log("Hello, world!");',
    '}',
    '',
    'helloWorld();'
  ];

  /** То, что уже напечатано на экране */
  displayedCode = '';

  private lineIdx = 0;
  private charIdx = 0;
  private typingTimer!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startTyping();
  }

  ngOnDestroy(): void {
    clearInterval(this.typingTimer);
  }

  /** Симуляция набора кода */
  private startTyping(): void {
    const speed = 60; // мс между символами

    this.typingTimer = setInterval(() => {
      if (this.lineIdx >= this.codeLines.length) {
        // Пауза и перезапуск, чтобы цикл шел по кругу
        clearInterval(this.typingTimer);
        setTimeout(() => {
          this.displayedCode = '';
          this.lineIdx = 0;
          this.charIdx = 0;
          this.startTyping();
        }, 2000);
        return;
      }

      const currentLine = this.codeLines[this.lineIdx];

      if (this.charIdx < currentLine.length) {
        this.displayedCode += currentLine[this.charIdx++];
      } else {
        // перенос строки, переход к следующей
        this.displayedCode += '\n';
        this.lineIdx++;
        this.charIdx = 0;
      }
    }, speed);
  }
}
