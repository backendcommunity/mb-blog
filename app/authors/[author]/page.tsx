import { getPostsByAuthor } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { AuthorPageClient } from "./author-client";

interface AuthorPageProps {
  params: Promise<{ author: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const { author: authorSlug } = await params;
  const { posts, total } = await getPostsByAuthor({
    slug: authorSlug,
    count: 100,
  });

  if (posts.length === 0) {
    notFound();
  }

  const authorInfo = posts[0].author;

  return {
    title: `Content by ${authorInfo.name} - Mastering Backend`,
    description: `${authorInfo.name} has published a total of ${total} backend engineering content on Mastering Backend`,
    openGraph: {
      title: `Content by ${authorInfo.name} - Mastering Backend`,
      description: `${authorInfo.name} has published a total of ${total} backend engineering content on Mastering Backend`,
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author: authorSlug } = await params;

  const { posts, total } = await getPostsByAuthor({
    slug: authorSlug,
    count: 100,
  });

  if (posts.length === 0) {
    notFound();
  }

  // Get author info from first post
  const authorInfo = posts[0].author;

  return (
    <AuthorPageClient authorInfo={authorInfo} posts={posts} total={total} />
  );
}
