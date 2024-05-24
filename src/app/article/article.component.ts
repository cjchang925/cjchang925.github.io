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

  /**
   * 是否已載入 markdown 檔案
   */
  public loaded: boolean = false;

  constructor(private spinner: NgxSpinnerService, private http: HttpClient) {}

  ngOnInit() {
    // 顯示 spinner 並載入 markdown 檔案
    this.spinner.show().then(async () => {
      await this.loadMarkdown();
    });
  }

  /**
   * 載入 markdown 檔案，完成後將 loaded 設為 true 並隱藏 spinner
   */
  public async loadMarkdown(): Promise<void> {
    this.markdown = await lastValueFrom(
      this.http
        .get('assets/articles/test.md', { responseType: 'text' })
        .pipe(take(1))
    );
    this.loaded = true;
    await this.spinner.hide();
  }
}
