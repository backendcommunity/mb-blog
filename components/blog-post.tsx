"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Bookmark,
  ThumbsUp,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Check,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import Header from "@/components/header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { BlogPost } from "@/lib/types";
import { htmlToText, renderBlogContent } from "@/lib/utils";

// Custom syntax highlighter component
const CodeBlock = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const language = className?.replace("language-", "") || "text";

  return (
    <div className="relative my-6">
      <div className="flex items-center justify-between bg-slate-800 dark:bg-slate-900 px-4 py-2 rounded-t-lg border-b border-slate-700 dark:border-slate-800">
        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(children)}
          className="text-slate-400 dark:text-slate-500 hover:text-[#13AECE] dark:hover:text-[#13AECE] text-sm px-3 py-1 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-800 transition-all"
        >
          Copy
        </button>
      </div>
      <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 dark:text-slate-200 p-4 rounded-b-lg overflow-x-auto border border-slate-800 dark:border-slate-900">
        <code className="text-sm leading-relaxed">{children}</code>
      </pre>
    </div>
  );
};

interface BlogPostClientProps {
  blogPost: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostClient({ blogPost, relatedPosts }: BlogPostClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blogPost.title;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShowShareMenu(false);
  };

  const excerptText = htmlToText(blogPost.excerpt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 font-sans">
      <Header />

      {/* Back to Blog */}
      <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-[#13AECE] hover:bg-[#13AECE]/10 dark:hover:bg-[#13AECE]/20 transition-all hover:scale-105 border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Category and Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link
              href={`/category/${blogPost.categorySlug}`}
              className="bg-gradient-to-r from-[#13AECE] to-[#0891b2] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:shadow-xl hover:shadow-[#13AECE]/30 transition-all hover:scale-105 shadow-lg shadow-[#13AECE]/20"
            >
              {blogPost.category}
            </Link>
            <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-500 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(blogPost.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
            {blogPost.title}
          </h1>

          {/* Author and Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <Link
              href={`/author/${blogPost.author.slug}`}
              className="flex items-center space-x-4 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#13AECE]/20 to-[#0891b2]/20 rounded-full flex items-center justify-center text-[#13AECE] font-bold text-xl border-2 border-[#13AECE]/30 shadow-lg shadow-[#13AECE]/10">
                  {blogPost.author.avatar || blogPost.author.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-[#13AECE] transition-colors">
                  {blogPost.author.name}
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-sm line-clamp-1">
                  {blogPost.author.bio}
                </p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
             
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 border border-slate-200 dark:border-slate-700"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 z-10 min-w-[160px]">
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-slate-700 dark:text-slate-200"
                    >
                      <Twitter className="w-4 h-4" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-slate-700 dark:text-slate-200"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-slate-700 dark:text-slate-200"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-slate-700 dark:text-slate-200"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-700">
            <img
              src={blogPost.image || "/placeholder.svg"}
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="article-content max-w-none overflow-x-hidden break-words"
            dangerouslySetInnerHTML={{
              __html: renderBlogContent(blogPost.content),
            }}
          />

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {blogPost.tags.map((tag, index) => (
                <Link
                  key={tag}
                  href={`/tag/${blogPost.tagSlugs[index] || tag.toLowerCase()}`}
                  className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-[#13AECE] hover:to-[#0891b2] hover:text-white transition-all hover:scale-105 border border-slate-200 dark:border-slate-700 hover:border-transparent hover:shadow-lg hover:shadow-[#13AECE]/30"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Related Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-1.5 h-10 bg-gradient-to-b from-[#13AECE] to-[#0891b2] rounded-full shadow-lg shadow-[#13AECE]/30"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Related Articles
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className="group">
                <article className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-[#13AECE]/10 dark:hover:shadow-[#13AECE]/20 hover:border-[#13AECE]/50 transition-all duration-500 group-hover:-translate-y-2 h-full backdrop-blur-sm">
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
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#13AECE] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-500 text-sm line-clamp-2">
                      {/* Ensure related posts don't render HTML tags either */}
                      {htmlToText(typeof post.excerpt === "string" ? post.excerpt : "")}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6IiBzdHJva2U9InJnYmEoMTksIDE3NCwgMjA2LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Enjoyed this article?
          </h2>
          <p className="text-slate-700 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for more backend engineering insights
            and tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#13AECE] focus:border-transparent transition-all dark:bg-white/5 dark:border-white/10 dark:text-white"
            />
            <button className="bg-[#13AECE] text-white px-8 py-4 rounded-xl hover:bg-[#13AECE]/90 transition-colors whitespace-nowrap font-semibold shadow-lg shadow-[#13AECE]/25">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
