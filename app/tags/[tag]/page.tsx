import { getPostsByTag } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { TagPageClient } from "./tag-client";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

function getTagName(posts: any, tagSlug: string) {
  const tagName = (() => {
    const tags = posts[0].tags;
    if (!tags || tags.length === 0) return tagSlug;
    const first = tags[0];
    if (typeof first === "string") {
      const match = (tags as string[]).find(
        (t) => t === tagSlug || t.toLowerCase() === tagSlug.toLowerCase()
      );
      return match || tagSlug;
    }
    const found = (tags as any[]).find((t) => t?.slug === tagSlug);
    return found?.name || tagSlug;
  })();

  return tagName;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag: tagSlug } = await params;
  const { posts, total } = await getPostsByTag({
    slug: tagSlug,
    count: 100,
  });

  if (posts.length === 0) {
    notFound();
  }

  const tagName = getTagName(posts, tagSlug);

  return {
    title: `${tagName} - Best Guides, Tips & Resources for ${tagName}`,
    description: `Explore the best ${tagName} tutorials, guides, tools, and real-world examples. 
Learn ${tagName} with actionable insights designed for backend engineers. 
Updated regularly.`,
    openGraph: {
      title: `${tagName} - Best Guides, Tips & Resources for ${tagName}`,
      description: `Explore the best ${tagName} tutorials, guides, tools, and real-world examples. 
Learn ${tagName} with actionable insights designed for backend engineers. 
Updated regularly.`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagSlug } = await params;
  const { posts, total } = await getPostsByTag({ slug: tagSlug, count: 100 });
  if (posts.length === 0) {
    notFound();
  }
  const tagName = getTagName(posts, tagSlug);
  return <TagPageClient tagName={tagName} posts={posts} total={total} />;
}
