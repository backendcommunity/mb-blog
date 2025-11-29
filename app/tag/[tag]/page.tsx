import { getPostsByTag } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { TagPageClient } from "./tag-client";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagSlug } = await params;
  const { posts, total } = await getPostsByTag({ slug: tagSlug, count: 100 });
  if (posts.length === 0) { notFound(); }
  const tagName = posts[0].tags && posts[0].tags.length > 0 ? posts[0].tags.find(t => t.slug === tagSlug)?.name || tagSlug : tagSlug;
  return <TagPageClient tagName={tagName} posts={posts} total={total} />;
}