import type { MetadataRoute } from 'next';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.masteringbackend.com'
).replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Search result pages are thin/duplicate content — crawlable via links
      // but not worth indexing.
      disallow: ['/?q=', '/*?q='],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
