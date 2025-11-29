"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Grid, List, Tag as TagIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Pagination } from "@/components/pagination";
import { htmlToText } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

interface TagPageClientProps {
  tagName: string;
  posts: BlogPost[];
  total: number;
}

export function TagPageClient({ tagName, posts, total }: TagPageClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1C] transition-colors duration-300 font-sans">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-[#0A0F1C]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BrandLogo size="sm" variant="default" />
            </Link>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-[#13AECE] hover:text-[#13AECE]/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#13AECE]/5 via-transparent to-transparent dark:from-[#13AECE]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-[#13AECE] rounded-2xl flex items-center justify-center shadow-xl">
              <TagIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                #{tagName}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mt-2">
                {total} article{total !== 1 ? "s" : ""} tagged with {tagName}
              </p>
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <div className="flex items-center bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#13AECE] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#13AECE] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {paginatedPosts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="h-full bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-[#13AECE]/30 dark:hover:border-[#13AECE]/30 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <Link
                          href={`/category/${post.categorySlug}`}
                          className="text-[#13AECE] font-semibold text-sm hover:underline"
                        >
                          {post.category}
                        </Link>
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#13AECE] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {htmlToText(post.excerpt)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {paginatedPosts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-[#13AECE]/30 dark:hover:border-[#13AECE]/30 transition-all duration-300 group-hover:-translate-x-1">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3 flex flex-col justify-center">
                        <div className="flex items-center space-x-4 mb-3">
                          <Link
                            href={`/category/${post.categorySlug}`}
                            className="text-[#13AECE] font-semibold text-sm hover:underline"
                          >
                            {post.category}
                          </Link>
                          <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#13AECE] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                          {htmlToText(post.excerpt)}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
