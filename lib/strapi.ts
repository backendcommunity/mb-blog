import type { StrapiPost, StrapiResponse, BlogPost, PostsResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_ENDPOINT_URL || process.env.BASE_ENDPOINT_URL || 'https://cms.masteringbackend.com/api';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || process.env.STRAPI_TOKEN;

// Calculate read time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Map Strapi post to frontend BlogPost format
export function mapPost(strapiPost: StrapiPost): BlogPost {
  const { id, attributes } = strapiPost;
  
  const category = attributes.categories?.data?.[0];
  const author = attributes.author?.data;
  const featuredImage = attributes.featured_image?.data?.attributes;
  
  return {
    id,
    title: attributes.title,
    slug: attributes.slug,
    excerpt: attributes.excerpt || '',
    content: attributes.content || '',
    category: category?.attributes?.name || 'Uncategorized',
    categorySlug: category?.attributes?.slug || 'uncategorized',
    tags: attributes.tags?.data?.map(tag => tag.attributes.name) || [],
    tagSlugs: attributes.tags?.data?.map(tag => tag.attributes.slug) || [],
    author: {
      name: author?.attributes?.name || 'Anonymous',
      slug: author?.attributes?.slug || 'anonymous',
      bio: author?.attributes?.bio || '',
      avatar: author?.attributes?.avatar?.url || '',
    },
    publishedAt: attributes.publishedAt || attributes.createdAt,
    updatedAt: attributes.updatedAt,
    readTime: calculateReadTime(attributes.content || ''),
    featured: attributes.type === 'featured' || false,
    image: featuredImage?.url || '/placeholder.svg?height=400&width=800',
    likes: Math.floor(Math.random() * 200) + 50, // Mock data
    comments: Math.floor(Math.random() * 50) + 5, // Mock data
    bookmarks: Math.floor(Math.random() * 100) + 20, // Mock data
  };
}

// Map multiple posts
export function mapPosts(strapiPosts: StrapiPost[]): BlogPost[] {
  return strapiPosts.map(mapPost);
}

// Fetch wrapper with authentication
async function fetchStrapi<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }
  
  const response = await fetch(url, {
    headers,
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  
  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Get all posts with pagination
export async function getPosts({
  page = 1,
  count = 22,
  populate = '*',
}: {
  page?: number;
  count?: number;
  populate?: string;
} = {}): Promise<PostsResponse> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&pagination[page]=${page}&pagination[pageSize]=${count}&sort[1]=createdAt%3Adesc&populate=${populate}`
    );
    
    return {
      posts: mapPosts(response.data),
      pages: response.meta.pagination?.pageCount || 1,
      total: response.meta.pagination?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], pages: 0, total: 0 };
  }
}

// Get sticky/featured posts
export async function getStickyPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[type][$eq]=featured&pagination[pageSize]=6&sort[1]=createdAt%3Adesc&populate=*`
    );
    
    return mapPosts(response.data);
  } catch (error) {
    console.error('Error fetching sticky posts:', error);
    return [];
  }
}

// Get recent posts
export async function getRecentPosts(count = 6): Promise<BlogPost[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&pagination[pageSize]=${count}&sort[1]=createdAt%3Adesc&populate=*`
    );
    
    return mapPosts(response.data);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string, populate = '*'): Promise<BlogPost | null> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[slug][$eq]=${slug}&populate=${populate}`
    );
    
    if (response.data.length > 0) {
      return mapPost(response.data[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Get posts by category
export async function getPostsByCategory({
  slug,
  page = 1,
  count = 22,
  populate = '*',
}: {
  slug: string;
  page?: number;
  count?: number;
  populate?: string;
}): Promise<PostsResponse> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[categories][slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${count}&populate=${populate}`
    );
    
    return {
      posts: mapPosts(response.data),
      pages: response.meta.pagination?.pageCount || 1,
      total: response.meta.pagination?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return { posts: [], pages: 0, total: 0 };
  }
}

// Get posts by tag
export async function getPostsByTag({
  slug,
  page = 1,
  count = 22,
  populate = '*',
}: {
  slug: string;
  page?: number;
  count?: number;
  populate?: string;
}): Promise<PostsResponse> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[tags][slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${count}&populate=${populate}`
    );
    
    return {
      posts: mapPosts(response.data),
      pages: response.meta.pagination?.pageCount || 1,
      total: response.meta.pagination?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching tag posts:', error);
    return { posts: [], pages: 0, total: 0 };
  }
}

// Get posts by author
export async function getPostsByAuthor({
  slug,
  page = 1,
  count = 22,
  populate = '*',
}: {
  slug: string;
  page?: number;
  count?: number;
  populate?: string;
}): Promise<PostsResponse> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[author][slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${count}&populate=${populate}`
    );
    
    return {
      posts: mapPosts(response.data),
      pages: response.meta.pagination?.pageCount || 1,
      total: response.meta.pagination?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching author posts:', error);
    return { posts: [], pages: 0, total: 0 };
  }
}

// Search posts
export async function searchPosts(query: string): Promise<BlogPost[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[$or][0][title][$containsi]=${query}&filters[$or][1][excerpt][$containsi]=${query}&filters[$or][2][content][$containsi]=${query}&populate=*`
    );
    
    return mapPosts(response.data);
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

// Get related posts (posts with similar tags or category)
export async function getRelatedPosts(postId: number, categorySlug: string, count = 3): Promise<BlogPost[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[categories][slug][$eq]=${categorySlug}&filters[id][$ne]=${postId}&pagination[pageSize]=${count}&populate=*`
    );
    
    return mapPosts(response.data);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
