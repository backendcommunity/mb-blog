import { getPostBySlug, getRelatedPosts } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/blog-post";
import { metaDescriptionFor } from "@/lib/utils";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://blog.masteringbackend.com"
).replace(/\/$/, "");

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getPostBySlug(id);

  if (!post) {
    notFound();
  }

  const title = post.title + " - Mastering Backend";

  // Strapi stores excerpt and content as HTML. Passing either straight into
  // metadata renders "&lt;p&gt;..." into the description tag, because Next
  // escapes strings written into attributes. metaDescriptionFor strips the
  // markup, decodes entities and truncates on a word boundary.
  const description = metaDescriptionFor(post);

  // `post.featured` is a boolean derived from is_sticky, not an image. It was
  // previously passed into the images array, which put "true"/"false" into
  // og:image. Only real image URLs belong here.
  const images = [post.image].filter(
    (src): src is string => typeof src === "string" && src.length > 0
  );

  const canonical = `${SITE_URL}/${id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images,
      siteName: "Mastering Backend",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
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

  // The <Head> block that used to sit here imported next/head, which is a
  // Pages Router API and a no-op in the App Router. It rendered nothing, and
  // duplicated the description that generateMetadata already sets.
  return <BlogPostClient blogPost={blogPost} relatedPosts={relatedPosts} />;
}
