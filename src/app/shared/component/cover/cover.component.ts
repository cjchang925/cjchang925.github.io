import { Component } from '@angular/core';
import { RwdService } from '../../service/rwd.service';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
})
export class CoverComponent {
  constructor(public rwdService: RwdService) {}
}
