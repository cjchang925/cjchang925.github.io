import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RwdService {
  /**
   * 瀏覽裝置是否為手機
   */
  public isMobile: boolean;

  constructor() {
    this.isMobile = window.innerWidth <= 768;
  }
}
