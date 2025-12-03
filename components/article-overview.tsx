"use client";

import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Tag, 
  ArrowRight,
  User
} from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { htmlToText } from "@/lib/utils";

interface ArticleOverviewProps {
  post: BlogPost;
}

export function ArticleOverview({ post }: ArticleOverviewProps) {
  return (
    <div className="mb-12">
      {/* Article Header */}
      <header className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
        {/* Featured Image */}
        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-6 left-6">
            <Link
              href={`/categories/${post.categorySlug}`}
              className="bg-gradient-to-r from-[#13AECE] to-[#0891b2] text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-xl hover:shadow-[#13AECE]/30 transition-all hover:scale-105 shadow-lg shadow-[#13AECE]/20"
            >
              {post.category}
            </Link>
          </div>

          {/* Article Meta in overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content Preview */}
        <div className="p-8">
          {/* Excerpt */}
          <div className="mb-6">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {htmlToText(post.excerpt)}
            </p>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/author/${post.author.slug}`}
              className="flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#13AECE]/20 to-[#0891b2]/20 rounded-full flex items-center justify-center text-[#13AECE] font-bold text-lg border-2 border-[#13AECE]/30">
                {post.author.avatar || post.author.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-[#13AECE] transition-colors">
                  {post.author.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 line-clamp-1">
                  {post.author.bio}
                </p>
              </div>
            </Link>

            {/* Reading Stats
            <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-500">
              {post.likes && (
                <div className="flex items-center space-x-1">
                  <span>👍</span>
                  <span>{post.likes}</span>
                </div>
              )}
              {post.comments && (
                <div className="flex items-center space-x-1">
                  <span>💬</span>
                  <span>{post.comments}</span>
                </div>
              )}
              {post.bookmarks && (
                <div className="flex items-center space-x-1">
                  <span>🔖</span>
                  <span>{post.bookmarks}</span>
                </div>
              )}
            </div> */}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link
                    key={tag}
                    href={`/tags/${post.tagSlugs[index] || tag.toLowerCase()}`}
                    className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full text-sm hover:bg-gradient-to-r hover:from-[#13AECE] hover:to-[#0891b2] hover:text-white transition-all hover:scale-105 border border-slate-200 dark:border-slate-700 hover:border-transparent"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Quick Navigation */}
      <div className="mt-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              Ready to dive in?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Start reading this comprehensive article
            </p>
          </div>
          <button 
            onClick={() => {
              const contentElement = document.querySelector('.article-content');
              if (contentElement) {
                contentElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center space-x-2 text-[#13AECE] font-medium hover:text-[#0891b2] transition-colors cursor-pointer"
          >
            <span>Continue Reading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
