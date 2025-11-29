import { getPostsByAuthor } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { AuthorPageClient } from "./author-client";

interface AuthorPageProps {
  params: Promise<{ author: string }>;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author: authorSlug } = await params;
  
  const { posts, total } = await getPostsByAuthor({ slug: authorSlug, count: 100 });
  
  if (posts.length === 0) {
    notFound();
  }

  // Get author info from first post
  const authorInfo = posts[0].author;

  return <AuthorPageClient authorInfo={authorInfo} posts={posts} total={total} />;
}
