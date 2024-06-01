import { Component } from '@angular/core';
import { Article, articles } from './articles';
import { Router } from '@angular/router';
import { RwdService } from '../shared/service/rwd.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent {
  /**
   * 所有文章
   */
  public articles: Article[] = articles;

  constructor(private router: Router, public rwdService: RwdService) {}

  /**
   * 點擊文章後跳轉至指定文章頁面
   * @param id 文章 id
   */
  public viewArticle(id: number): void {
    this.router.navigateByUrl(`/article/${id}`);
  }
}
