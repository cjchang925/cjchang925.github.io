import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  /**
   * markdown 內容
   */
  public markdown: string = '';

  /**
   * 是否已載入 markdown 檔案
   */
  public loaded: boolean = false;

  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    // 顯示 spinner
    await this.spinner.show();
    this.cdr.markForCheck();

    // 取得 markdown 檔案並隱藏 spinner
    this.http.get('assets/articles/test.md', { responseType: 'text' }).subscribe(async (data) => {
      this.markdown = data;
      this.loaded = true;
      await this.spinner.hide();
    });
  }
}
