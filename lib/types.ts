// Strapi API Response Types
export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface StrapiAuthor {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  avatar?: StrapiImage;
}

export interface StrapiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface StrapiTag {
  id: number;
  name: string;
  slug: string;
}

export interface StrapiChapter {
  id: number;
  title: string;
  slug: string;
  posts?: StrapiPost[];
}

export interface StrapiPostAttributes {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  is_public: boolean;
  type?: string;
  featured_image?: {
    data?: {
      attributes: StrapiImage;
    };
  };
  author?: {
    data?: {
      id: number;
      attributes: StrapiAuthor;
    };
  };
  categories?: {
    data: Array<{
      id: number;
      attributes: StrapiCategory;
    }>;
  };
  tags?: {
    data: Array<{
      id: number;
      attributes: StrapiTag;
    }>;
  };
  chapters?: {
    data: Array<{
      id: number;
      attributes: StrapiChapter;
    }>;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiPost {
  id: number;
  attributes: StrapiPostAttributes;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Frontend Blog Post Types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  tags: string[];
  tagSlugs: string[];
  author: {
    name: string;
    slug: string;
    bio: string;
    avatar: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  featured: boolean;
  image: string;
  likes?: number;
  comments?: number;
  bookmarks?: number;
}

export interface PostsResponse {
  posts: BlogPost[];
  pages: number;
  total: number;
}
