// Snippet type cho list/card display
export interface SnippetListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  viewCount: number;
  commentCount: number;
  isPublic: boolean;
  createdAt: Date | string;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

// Pagination type
export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}
