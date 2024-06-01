import { Component } from '@angular/core';
import { RwdService } from '../../service/rwd.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('showMobileNav', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false => true', animate('0.2s', style({ opacity: 1 }))),
      transition('true => false', animate('0s', style({ opacity: 0 }))),
    ]),
  ]
})
export class NavbarComponent {
  /**
   * 是否顯示手機版導覽列
   */
  public showMobileNav: boolean = false;

  constructor(public rwdService: RwdService) {}
}
