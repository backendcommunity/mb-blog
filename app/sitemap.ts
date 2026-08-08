import type { MetadataRoute } from 'next';
import { getAllPostSlugs, getTaxonomySlugs } from '@/lib/strapi';

export const revalidate = 3600; // rebuild hourly

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.masteringbackend.com'
).replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags, authors] = await Promise.all([
    getAllPostSlugs(),
    getTaxonomySlugs('categories'),
    getTaxonomySlugs('tags'),
    getTaxonomySlugs('authors'),
  ]);

  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map(post => ({
      url: `${SITE_URL}/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...categories.map(slug => ({
      url: `${SITE_URL}/categories/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...tags.map(slug => ({
      url: `${SITE_URL}/tags/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
    ...authors.map(slug => ({
      url: `${SITE_URL}/authors/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ];
}
