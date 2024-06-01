/**
 * 文章
 */
export interface Article {
  /**
   * 序號
   */
  id: number;

  /**
   * 標題
   */
  title: string;

  /**
   * 副標題
   */
  subtitle: string;

  /**
   * 撰寫時間
   */
  date: string;

  /**
   * Markdown 檔案路徑
   */
  documentPath: string;

  /**
   * 封面圖片路徑
   */
  coverImagePath: string;
}

/**
 * 所有文章
 */
export const articles: Article[] = [
  {
    id: 0,
    title: 'Testing my own website',
    subtitle: 'Test',
    date: '2024/06/01',
    documentPath: 'assets/articles/test.md',
    coverImagePath: 'assets/images/myself.png',
  },
  {
    id: 1,
    title: 'Test',
    subtitle: 'Test',
    date: '2024/06/01',
    documentPath: 'assets/articles/test2.md',
    coverImagePath: 'assets/images/myself.png',
  },
];
