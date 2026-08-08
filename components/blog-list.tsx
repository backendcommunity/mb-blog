"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Pagination } from "@/components/pagination";
import type { BlogPost } from "@/lib/types";
import { htmlToText } from "@/lib/utils";

interface BlogListProps {
  /** Posts for the current page only — filtering and paging happen server-side. */
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  categories: string[];
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  selectedCategory: string;
}

/**
 * Build a homepage URL from the current filter state.
 *
 * Everything that changes what's on screen lives in the URL, so each view is a
 * real, crawlable, shareable address. Empty/default values are omitted to keep
 * canonical URLs clean and avoid `?page=1` duplicates of `/`.
 */
function buildUrl({
  page,
  q,
  category,
}: {
  page?: number;
  q?: string;
  category?: string;
}): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category && category !== "All") params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export function BlogList({
  posts,
  featuredPosts,
  categories,
  currentPage,
  totalPages,
  searchTerm,
  selectedCategory,
}: BlogListProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ q: searchInput.trim(), category: selectedCategory }));
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search for articles, topics..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search articles"
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13AECE] focus:border-transparent shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 transition-all hover:shadow-xl"
            />
            <button type="submit" className="sr-only">
              Search
            </button>
          </form>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#13AECE] text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#13AECE] text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-4 rounded-2xl border transition-all shadow-lg ${
                showFilters
                  ? "bg-[#13AECE] text-white border-[#13AECE] shadow-[#13AECE]/30"
                  : "bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#13AECE] dark:hover:border-[#13AECE] shadow-slate-200/50 dark:shadow-slate-900/50"
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Category Filters — real links, so each category view is indexable */}
        {showFilters && (
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={buildUrl({ q: searchTerm, category })}
                scroll={false}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-[#13AECE] text-white shadow-lg shadow-[#13AECE]/30"
                    : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#13AECE] dark:hover:border-[#13AECE] hover:shadow-md"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Posts — only on the unfiltered first page */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#13AECE] to-[#0891b2] rounded-full shadow-lg shadow-[#13AECE]/30"></div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Featured Stories
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="h-full bg-white dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-[#13AECE]/10 dark:hover:shadow-[#13AECE]/20 hover:border-[#13AECE]/50 dark:hover:border-[#13AECE]/50 transition-all duration-500 group-hover:-translate-y-2 backdrop-blur-sm">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-[#13AECE] to-[#0891b2] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#13AECE]/30">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-[#13AECE] text-xs font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                        {post.readTime && (
                          <>
                            <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[#13AECE] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
                        {htmlToText(post.excerpt)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#13AECE]/20 to-[#0891b2]/20 rounded-full flex items-center justify-center text-[#13AECE] font-bold text-sm">
                            {post.author.avatar ||
                              post.author.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {post.author.name}
                            </p>
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#13AECE] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#13AECE] to-[#0891b2] rounded-full shadow-lg shadow-[#13AECE]/30"></div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {searchTerm
                  ? `Results for “${searchTerm}”`
                  : selectedCategory !== "All"
                  ? selectedCategory
                  : "Latest Articles"}
              </h2>
            </div>
          </div>

          {posts.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No articles found
              {searchTerm ? ` for “${searchTerm}”` : ""}.{" "}
              <Link href="/" className="text-[#13AECE] hover:underline">
                Clear filters
              </Link>
            </p>
          ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {posts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-[#13AECE]/10 dark:hover:shadow-[#13AECE]/20 hover:border-[#13AECE]/50 dark:hover:border-[#13AECE]/50 transition-all duration-500 group-hover:-translate-y-2 backdrop-blur-sm">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-[#13AECE] text-xs font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                        {post.readTime && (
                          <>
                            <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#13AECE] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                        {htmlToText(post.excerpt)}
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#13AECE]/20 to-[#0891b2]/20 rounded-full flex items-center justify-center text-[#13AECE] font-bold text-xs">
                          {post.author.avatar ||
                            post.author.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {post.author.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-[#13AECE]/10 dark:hover:shadow-[#13AECE]/20 hover:border-[#13AECE]/50 dark:hover:border-[#13AECE]/50 transition-all duration-500 group-hover:-translate-x-2 backdrop-blur-sm">
                    <div className="flex gap-6">
                      <div className="w-48 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-[#13AECE] text-xs font-bold uppercase tracking-wider">
                            {post.category}
                          </span>
                          {post.readTime && (
                            <>
                              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{post.readTime}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#13AECE] transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                          {htmlToText(post.excerpt)}
                        </p>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#13AECE]/20 to-[#0891b2]/20 rounded-full flex items-center justify-center text-[#13AECE] font-bold text-xs">
                            {post.author.avatar ||
                              post.author.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {post.author.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination — link mode, so every page has a crawlable URL */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                buildHref={(page) =>
                  buildUrl({ page, q: searchTerm, category: selectedCategory })
                }
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
