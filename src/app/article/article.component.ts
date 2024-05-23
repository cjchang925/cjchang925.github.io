import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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

  constructor(private spinner: NgxSpinnerService, private http: HttpClient) {}

  /**
   * 啟動 spinner 並載入 markdown 檔案
   */
  async ngOnInit(): Promise<void> {
    await this.spinner.show();
    await this.loadMarkdown();
    await this.afterLoading();
  }

  public async loadMarkdown(): Promise<void> {
    this.markdown = await lastValueFrom(
      this.http
        .get('assets/articles/test.md', { responseType: 'text' })
        .pipe(take(1))
    );
  }

  /**
   * 載入 markdown 檔案後，隱藏 spinner
   */
  public async afterLoading(): Promise<void> {
    await this.spinner.hide();
  }
}
