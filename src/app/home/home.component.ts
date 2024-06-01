import { Component } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  stagger,
  query,
} from '@angular/animations';
import { greetings } from './home';
import { RwdService } from '../shared/service/rwd.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('appearAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            stagger(50, [animate('50ms', style({ opacity: 1 }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  /**
   * 首頁介紹文字
   */
  public greetings: string[][] = greetings;

  /**
   * 首頁介紹文字動畫狀態
   */
  public animationState: number = 0;

  constructor(public rwdService: RwdService) {}

  /**
   * 每一行的動畫完成後，將狀態加一，觸發下一行的動畫
   */
  public animationDone(): void {
    this.animationState++;
  }
}
