import { getPostBySlug, getRelatedPosts } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/blog-post";
import Head from "next/head";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getPostBySlug(id);

  if (!post) {
    notFound();
  }

  return {
    title: post.title + " - Mastering Backend",
    description: post.excerpt,
    openGraph: {
      title: post.title + " - Mastering Backend",
      description: post.excerpt,
      images: [post?.featured, post?.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;

  const blogPost = await getPostBySlug(id);

  if (!blogPost) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    blogPost.id,
    blogPost.categorySlug,
    3
  );

  return (
    <>
      <Head>
        <title>{blogPost.title} - Masteringbackend</title>
        <meta name="description" content={blogPost.excerpt} />
      </Head>

      <BlogPostClient blogPost={blogPost} relatedPosts={relatedPosts} />
    </>
  );
}
