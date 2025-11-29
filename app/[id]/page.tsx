import { getPostBySlug, getRelatedPosts } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/blog-post";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  
  const blogPost = await getPostBySlug(id);
  
  if (!blogPost) {
    notFound();
  }
  
  const relatedPosts = await getRelatedPosts(blogPost.id, blogPost.categorySlug, 3);
  
  return (
    <BlogPostClient blogPost={blogPost} relatedPosts={relatedPosts} />
  );
}
