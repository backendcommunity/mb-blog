"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Grid,
  List,
  Filter,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";
import Header from "@/components/header";
import { Pagination } from "@/components/pagination";
import { htmlToText } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

interface AuthorPageClientProps {
  authorInfo: {
    name: string;
    slug: string;
    bio: string;
    avatar: string;
  };
  posts: BlogPost[];
  total: number;
}

export function AuthorPageClient({
  authorInfo,
  posts,
  total,
}: AuthorPageClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const style = {
    margin: "0",
    backgroundColor: "transparent",
    width: "100%",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1C] transition-colors duration-300 font-sans">
      <Header />

      {/* Back to Blog */}
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

      {/* Author Profile */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#13AECE]/5 via-transparent to-transparent dark:from-[#13AECE]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Author Info */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl sticky top-24 border border-slate-200 dark:border-slate-700 shadow-xl">
                {/* Avatar and Basic Info */}
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-[#13AECE] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white font-bold text-4xl">
                      {authorInfo.avatar ||
                        authorInfo.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {authorInfo.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    {authorInfo.bio}
                  </p>
                  {/* Social Icons */}
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <a
                      href="#"
                      aria-label="Twitter"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#13AECE] hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      aria-label="LinkedIn"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#13AECE] hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      aria-label="Facebook"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#13AECE] hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="text-2xl font-bold text-[#13AECE]">
                      {total}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                      Articles
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Author's Content */}
            <div className="lg:col-span-2">
              {/* Content Header */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Content by {authorInfo.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {posts.length} article{posts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

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

              {/* Content Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {paginatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className="group"
                    >
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
                              href={`/categories/${post.categorySlug}`}
                              className="text-[#13AECE] text-sm font-medium hover:underline"
                            >
                              {post.category}
                            </Link>
                            <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#13AECE] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                            {htmlToText(post.excerpt)}
                          </p>
                          <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100 dark:border-slate-700">
                            <span className="text-slate-500 dark:text-slate-400">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {paginatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className="group"
                    >
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
                          <div className="md:w-2/3">
                            <div className="flex items-center space-x-4 mb-3">
                              <Link
                                href={`/categories/${post.categorySlug}`}
                                className="text-[#13AECE] text-sm font-medium hover:underline"
                              >
                                {post.category}
                              </Link>
                              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    post.publishedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#13AECE] transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                              {htmlToText(post.excerpt)}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}

              {posts.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No content found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    This author hasn't published any articles yet.
                  </p>
                </div>
              )}
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
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1C] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6IiBzdHJva2U9InJnYmEoMTksIDE3NCwgMjA2LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Follow {authorInfo.name}
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
            Stay updated with {authorInfo.name}'s latest articles and insights
            on backend development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            {/* <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#13AECE] focus:border-transparent transition-all"
            />
            <button className="bg-[#13AECE] text-white px-8 py-4 rounded-xl hover:bg-[#13AECE]/90 transition-colors whitespace-nowrap font-semibold shadow-lg shadow-[#13AECE]/25">
              Follow
            </button> */}

            <iframe
              src="https://kaperskyguru.substack.com/embed"
              width="480"
              height="150"
              style={style}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
