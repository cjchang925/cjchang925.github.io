import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  stagger,
  query,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('appearAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(50, [animate('50ms', style({ opacity: 1 }))]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class HomeComponent {
  /**
   * 首頁介紹文字
   */
  public greetings: string[][] = [
    ['👋', ' ', 'H', 'i', ',', ' ', 'I', ' ', 'a', 'm'],
    ['🙂', ' ', 'C', 'h', 'i', '-', 'C', 'h', 'u', 'n', ' ', 'C', 'h', 'a', 'n', 'g', ','],
    ['👨‍💻', ' ', 'A', ' ', 'F', 'u', 'l', 'l', ' ', 'S', 't', 'a', 'c', 'k', ' ', 'D', 'e', 'v', 'e', 'l', 'o', 'p', 'e', 'r', ','],
    ['😉', ' ', 'W', 'e', 'l', 'c', 'o', 'm', 'e', ' ', 't', 'o', ' ', 'm', 'y', ' ', 'L', 'a', 'b', '!'],
  ]

  /**
   * 首頁介紹文字動畫狀態
   */
  public animationState: number = 0;

  ngOnInit() {
    // 等待 1 秒後，開始播放第二行文字
    setTimeout(() => {
      this.animationState = 1;
    }, 500);

    // 等待 1.9 秒後，開始播放第三行文字
    setTimeout(() => {
      this.animationState = 2;
    }, 1400);

    // 等待 3.2 秒後，開始播放第四行文字
    setTimeout(() => {
      this.animationState = 3;
    }, 2700);
  }
}
