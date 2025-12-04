import { getPostsByCategory } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { CategoryPageClient } from "./category-client";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { posts, total } = await getPostsByCategory({
    slug: categorySlug,
    count: 100,
  });

  if (posts.length === 0) {
    notFound();
  }

  const categoryName = posts[0].category;

  return {
    title: `${categoryName} - Best Guides, Tips & Resources for ${categoryName}`,
    description: `Explore the best ${categoryName} tutorials, guides, tools, and real-world examples. 
Learn ${categoryName} with actionable insights designed for backend engineers. 
Updated regularly.`,
    openGraph: {
      title: `${categoryName} - Best Guides, Tips & Resources for ${categoryName}`,
      description: `Explore the best ${categoryName} tutorials, guides, tools, and real-world examples. 
Learn ${categoryName} with actionable insights designed for backend engineers. 
Updated regularly.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { posts, total } = await getPostsByCategory({
    slug: categorySlug,
    count: 100,
  });
  if (posts.length === 0) {
    notFound();
  }
  const categoryName = posts[0].category;
  return (
    <CategoryPageClient
      categoryName={categoryName}
      posts={posts}
      total={total}
    />
  );
}
