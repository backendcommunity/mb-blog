"use client";

import { useState } from "react";
import Link from "next/link";
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
  initialPosts: BlogPost[];
  initialFeaturedPosts: BlogPost[];
  categories: string[];
}

export function BlogList({
  initialPosts,
  initialFeaturedPosts,
  categories,
}: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);
  const [featuredPosts, setFeaturedPosts] = useState(initialFeaturedPosts);
  const postsPerPage = 6;

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      htmlToText(post.excerpt)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFeaturedPosts = featuredPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      htmlToText(post.excerpt)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const regularPosts = filteredPosts.filter((post) => !post.featured);

  // Pagination for regular posts
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = regularPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for articles, topics..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13AECE] focus:border-transparent shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 transition-all hover:shadow-xl"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
              <button
                onClick={() => setViewMode("grid")}
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

        {/* Category Filters */}
        {showFilters && (
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-[#13AECE] text-white shadow-lg shadow-[#13AECE]/30"
                    : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#13AECE] dark:hover:border-[#13AECE] hover:shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Posts */}
      {filteredFeaturedPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#13AECE] to-[#0891b2] rounded-full shadow-lg shadow-[#13AECE]/30"></div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Featured Stories
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
              {filteredFeaturedPosts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="h-full bg-white dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-[#13AECE]/10 dark:hover:shadow-[#13AECE]/20 hover:border-[#13AECE]/50 dark:hover:border-[#13AECE]/50 transition-all duration-500 group-hover:-translate-y-2 backdrop-blur-sm">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
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
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
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
                                {new Date(
                                  post.publishedAt
                                ).toLocaleDateString()}
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
                Latest Articles
              </h2>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {paginatedPosts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-[#13AECE]/10 dark:hover:shadow-[#13AECE]/20 hover:border-[#13AECE]/50 dark:hover:border-[#13AECE]/50 transition-all duration-500 group-hover:-translate-y-2 backdrop-blur-sm">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-[#13AECE] text-xs font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
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
              {paginatedPosts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="group">
                  <article className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-[#13AECE]/10 dark:hover:shadow-[#13AECE]/20 hover:border-[#13AECE]/50 dark:hover:border-[#13AECE]/50 transition-all duration-500 group-hover:-translate-x-2 backdrop-blur-sm">
                    <div className="flex gap-6">
                      <div className="w-48 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-[#13AECE] text-xs font-bold uppercase tracking-wider">
                            {post.category}
                          </span>
                          <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
