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
    title: 'Cartographer Research Notes',
    subtitle: 'Exploring one of the best 3D SLAM algorithm',
    date: 'May 9, 2022',
    documentPath: 'assets/articles/test.md',
    coverImagePath: 'assets/images/nctu-point-cloud-map.jpeg',
  },
];
