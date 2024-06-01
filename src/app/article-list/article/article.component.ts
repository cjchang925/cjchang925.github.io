import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { articles } from '../articles';
import { RwdService } from 'src/app/shared/service/rwd.service';

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

  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    public rwdService: RwdService
  ) {}

  async ngOnInit(): Promise<void> {
    // 剛進到文章頁面時，可能不在頁面頂部，因此手動滾動到最上方
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // 取得文章 id
    const articleId = parseInt(this.route.snapshot.params['id']);
    const article = articles.find((article) => article.id === articleId);

    // 若文章不存在則跳轉至文章列表頁面
    if (!article) {
      this.router.navigateByUrl('/article');
      return;
    }

    // 顯示 spinner
    await this.spinner.show();
    this.cdr.markForCheck();

    // 取得 markdown 檔案並隱藏 spinner
    this.http
      .get(article.documentPath, { responseType: 'text' })
      .subscribe(async (data) => {
        this.markdown = data;
        this.loaded = true;
        await this.spinner.hide();
      });
  }
}
