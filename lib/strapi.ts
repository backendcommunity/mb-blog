import type { StrapiPost, StrapiResponse, BlogPost, PostsResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_ENDPOINT_URL || process.env.BASE_ENDPOINT_URL || 'https://cms.masteringbackend.com/api';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || process.env.STRAPI_TOKEN;

const WORDS_PER_MINUTE = 200;

// Fallback for posts whose read_time has not been backfilled yet. Only usable
// when `content` is present, which is the single-post case.
function calculateReadTime(content: string): number {
  const text = String(content ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));
}

function formatReadTime(minutes: number): string {
  return minutes > 0 ? `${minutes} min read` : '';
}

/* -------------------------------------------------------------------------
 * Query fragments
 *
 * List endpoints deliberately do NOT fetch `content`. The article body is the
 * largest field on a post by a wide margin and nothing in the list UI renders
 * it — it was only ever read to count words for the "N min read" label. That
 * number now lives on the post as `read_time`, computed server-side.
 *
 * `populate=*` is also avoided: it pulls `chapters`, `user` and `resource`,
 * none of which the list touches. Strapi's own docs advise against wildcard
 * populate in production.
 * ---------------------------------------------------------------------- */

/**
 * Whether the CMS has the `post.read_time` field yet.
 *
 * `fields` is an allowlist and Strapi 5 validates it: selecting a field the
 * content type doesn't have fails the whole request with
 * `400 Invalid key read_time`, not a silent omission.
 *
 * The field ships with the CMS side of the Strapi 5 upgrade, so during the
 * deploy window — or when running the blog locally against a CMS that hasn't
 * been updated — set `STRAPI_HAS_READ_TIME=false` to drop it from the query.
 * Read-time badges are hidden while it's off; everything else works.
 *
 * Defaults to on, which is the correct steady state once the CMS is deployed.
 */
const HAS_READ_TIME =
  (process.env.NEXT_PUBLIC_STRAPI_HAS_READ_TIME ??
    process.env.STRAPI_HAS_READ_TIME ??
    'true') !== 'false';

// Scalar fields the list cards actually render. Note `fields` excludes the
// timestamps unless they're named explicitly, and mapPost needs them.
const LIST_FIELDS = [
  'title',
  'slug',
  'excerpt',
  'publishedAt',
  'createdAt',
  'updatedAt',
  'type',
  'color',
  'is_sticky',
  ...(HAS_READ_TIME ? ['read_time'] : []),
]
  .map((field, i) => `fields[${i}]=${field}`)
  .join('&');

// Relations the list cards render, each narrowed to the fields used.
const LIST_POPULATE = [
  'populate[author][fields][0]=name',
  'populate[author][fields][1]=slug',
  'populate[categories][fields][0]=name',
  'populate[categories][fields][1]=slug',
  'populate[tags][fields][0]=name',
  'populate[tags][fields][1]=slug',
  'populate[featured_image][fields][0]=url',
].join('&');

const LIST_QUERY = `${LIST_FIELDS}&${LIST_POPULATE}`;

// Deep population for a single post.
//
// Strapi 5 only supports dot-notation (`chapters.posts.author`) for COMPONENTS,
// not for relations. Nested relations require the bracket form
// `populate[relation][populate][nested]`. The old dot-notation string silently
// populated nothing beyond the first level, so chapters came back without their
// posts. See https://docs.strapi.io/cms/api/rest/populate-select
const SINGLE_POST_POPULATE = [
  'populate[author]=true',
  'populate[categories]=true',
  'populate[tags]=true',
  'populate[featured_image]=true',
  'populate[chapters][populate][featured_image]=true',
  'populate[chapters][populate][posts][populate][author]=true',
  'populate[chapters][populate][posts][populate][categories]=true',
  'populate[chapters][populate][posts][populate][featured_image]=true',
].join('&');

// Map Strapi post to frontend BlogPost format
export function mapPost(strapiPost: StrapiPost): BlogPost {
  const { id, attributes } = strapiPost;
  const category = attributes.categories?.data?.[0];
  const author = attributes.author?.data;
  const featuredImage = attributes.featured_image?.data?.attributes;

  // Prefer the stored read_time. Fall back to computing from content only when
  // content is present (single-post queries) and read_time hasn't been
  // backfilled — list queries never carry content, so this stays 0 there.
  const readTimeMinutes =
    typeof attributes.read_time === 'number' && attributes.read_time > 0
      ? attributes.read_time
      : calculateReadTime(attributes.content || '');

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
      // From ee2a66b (social links on author profiles).
      //
      // These are safe to read even though the author content type has no
      // x/linkedin/facebook/bio attributes — they resolve to undefined and
      // fall back to ''. They must NOT be added to a `fields` selection until
      // the CMS has them: `fields` is an allowlist and an unknown key fails
      // the whole request with a 400 (see HAS_READ_TIME above).
      x: author?.attributes?.x || '',
      linkedin: author?.attributes?.linkedin || '',
      facebook: author?.attributes?.facebook || '',
    },
    publishedAt: attributes.publishedAt || attributes.createdAt,
    updatedAt: attributes.updatedAt,
    readTime: formatReadTime(readTimeMinutes),
    featured: attributes.is_sticky ?? false,
    image: featuredImage?.url || '/placeholder.svg?height=400&width=800',
    likes: Math.floor(Math.random() * 200) + 50, // Mock data
    comments: Math.floor(Math.random() * 50) + 5, // Mock data
    bookmarks: Math.floor(Math.random() * 100) + 20, // Mock data
    type: attributes.type,
    color: attributes.color,
    chapters: attributes.chapters?.data?.map(chapter => ({
      id: chapter.id,
      title: chapter.attributes.title,
      slug: chapter.attributes.slug,
      description: chapter.attributes.description,
      summary: chapter.attributes.summary,
      content: chapter.attributes.content,
      color: chapter.attributes.color,
      featured_image: chapter.attributes.featured_image?.data?.attributes?.url,
      posts: chapter.attributes.posts?.data?.map((post: StrapiPost) => {
        return {
          ...mapPost(post),
        };
      }) || []
    })) || []
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
    // TEMPORARY — Strapi 5 migration bridge.
    //
    // Strapi 5 flattened the REST response: `data.attributes.title` is now
    // `data.title`, relations lost their `.data` wrapper, and media lost
    // `.data.attributes`. This header makes v5 emit the old v4 shape so
    // mapPost() below keeps working unchanged.
    //
    // Remove once mapPost() and lib/types.ts have been migrated to the flat
    // v5 shape. Note this is a compatibility aid Strapi provides for
    // migrations, not a supported long-term mode — don't leave it here.
    'Strapi-Response-Format': 'v4',
  };

  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    // Strapi returns a JSON body describing exactly what it rejected — an
    // invalid field name, an unknown filter, a bad populate path. Throwing only
    // the status code discards the one thing that makes a 400 diagnosable.
    let detail = '';
    try {
      const body: any = await response.json();
      detail =
        body?.error?.message ||
        body?.message ||
        JSON.stringify(body?.error ?? body);
      if (body?.error?.details && Object.keys(body.error.details).length) {
        detail += ` — ${JSON.stringify(body.error.details)}`;
      }
    } catch {
      detail = await response.text().catch(() => '');
    }

    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}` +
        (detail ? `\n  ${detail}` : '') +
        `\n  ${url}`
    );
  }

  return response.json();
}

/**
 * Get posts with pagination.
 *
 * NOTE: the backend caps page size at `rest.maxLimit` (currently 100 in
 * config/api.ts). Requesting more than that is silently truncated, so keep
 * `count` at or below it.
 */
export async function getPosts({
  page = 1,
  count = 12,
  category,
  query,
}: {
  page?: number;
  count?: number;
  category?: string;
  query?: string;
} = {}): Promise<PostsResponse> {
  try {
    const filters = ['filters[is_public][$eq]=true'];

    if (category && category !== 'All') {
      filters.push(`filters[categories][name][$eq]=${encodeURIComponent(category)}`);
    }

    if (query) {
      const q = encodeURIComponent(query);
      filters.push(
        `filters[$or][0][title][$containsi]=${q}`,
        `filters[$or][1][excerpt][$containsi]=${q}`,
        `filters[$or][2][tags][name][$containsi]=${q}`
      );
    }

    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?${filters.join('&')}&pagination[page]=${page}&pagination[pageSize]=${count}&sort[0]=createdAt%3Adesc&${LIST_QUERY}`
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
      // Was filters[type][$eq]=featured, but `type` is an enumeration of
      // hub|definitive|sponsored|ultimate|book|pdf — "featured" was never a
      // valid value, so this query always returned an empty set. The intended
      // field is the is_sticky boolean.
      `/posts?filters[is_public][$eq]=true&filters[is_sticky][$eq]=true&pagination[pageSize]=6&sort[0]=createdAt%3Adesc&${LIST_QUERY}`
    );

    return mapPosts(response.data);
  } catch (error) {
    console.error('Error fetching sticky posts:', error);
    return [];
  }
}

/**
 * Distinct category names, for the filter row.
 *
 * Previously derived by scanning every post on the homepage — which was one of
 * the reasons the page fetched all posts at once. Querying the category
 * collection directly is a few hundred bytes instead.
 */
export async function getCategoryNames(): Promise<string[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<Array<{ id: number; attributes: { name: string } }>>>(
      `/categories?fields[0]=name&sort[0]=name%3Aasc&pagination[pageSize]=100`
    );

    const names = response.data
      .map(c => c.attributes?.name)
      .filter((n): n is string => Boolean(n));

    return ['All', ...names];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['All'];
  }
}

// Get recent posts
export async function getRecentPosts(count = 6): Promise<BlogPost[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&pagination[pageSize]=${count}&sort[0]=createdAt%3Adesc&${LIST_QUERY}`
    );

    return mapPosts(response.data);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string, populate = SINGLE_POST_POPULATE): Promise<BlogPost | null> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&${populate}`
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

/**
 * Every post slug, for the sitemap. Slug + dates only — no relations, no body.
 * Pages through the API so it isn't capped by rest.maxLimit.
 */
export async function getAllPostSlugs(): Promise<Array<{ slug: string; updatedAt: string }>> {
  const all: Array<{ slug: string; updatedAt: string }> = [];
  let page = 1;

  try {
    for (;;) {
      const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
        `/posts?filters[is_public][$eq]=true&fields[0]=slug&fields[1]=updatedAt&pagination[page]=${page}&pagination[pageSize]=100&sort[0]=createdAt%3Adesc`
      );

      if (!response.data?.length) break;

      all.push(
        ...response.data
          .filter(p => p.attributes?.slug)
          .map(p => ({
            slug: p.attributes.slug,
            updatedAt: p.attributes.updatedAt || p.attributes.createdAt,
          }))
      );

      const pageCount = response.meta.pagination?.pageCount ?? 1;
      if (page >= pageCount) break;
      page += 1;
    }
  } catch (error) {
    console.error('Error fetching post slugs:', error);
  }

  return all;
}

/** Slugs for a taxonomy collection, for the sitemap. */
export async function getTaxonomySlugs(
  collection: 'categories' | 'tags' | 'authors'
): Promise<string[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<Array<{ attributes: { slug: string } }>>>(
      `/${collection}?fields[0]=slug&pagination[pageSize]=100`
    );

    return response.data.map(item => item.attributes?.slug).filter(Boolean);
  } catch (error) {
    console.error(`Error fetching ${collection} slugs:`, error);
    return [];
  }
}

// Get posts by category
export async function getPostsByCategory({
  slug,
  page = 1,
  count = 12,
}: {
  slug: string;
  page?: number;
  count?: number;
}): Promise<PostsResponse> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[categories][slug][$eq]=${encodeURIComponent(slug)}&pagination[page]=${page}&pagination[pageSize]=${count}&sort[0]=createdAt%3Adesc&${LIST_QUERY}`
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
  count = 12,
}: {
  slug: string;
  page?: number;
  count?: number;
}): Promise<PostsResponse> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[tags][slug][$eq]=${encodeURIComponent(slug)}&pagination[page]=${page}&pagination[pageSize]=${count}&sort[0]=createdAt%3Adesc&${LIST_QUERY}`
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
  count = 12,
}: {
  slug: string;
  page?: number;
  count?: number;
}): Promise<PostsResponse> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[author][slug][$eq]=${encodeURIComponent(slug)}&pagination[page]=${page}&pagination[pageSize]=${count}&sort[0]=createdAt%3Adesc&${LIST_QUERY}`
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
    const q = encodeURIComponent(query);
    const response = await fetchStrapi<StrapiResponse<StrapiPost[]>>(
      `/posts?filters[is_public][$eq]=true&filters[$or][0][title][$containsi]=${q}&filters[$or][1][excerpt][$containsi]=${q}&filters[$or][2][content][$containsi]=${q}&pagination[pageSize]=50&${LIST_QUERY}`
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
      `/posts?filters[is_public][$eq]=true&filters[categories][slug][$eq]=${encodeURIComponent(categorySlug)}&filters[id][$ne]=${postId}&pagination[pageSize]=${count}&${LIST_QUERY}`
    );

    return mapPosts(response.data);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
