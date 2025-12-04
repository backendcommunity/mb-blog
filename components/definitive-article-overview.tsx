"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  BookOpen,
  Clock,
  CheckCircle,
  ArrowRight,
  List,
  Calendar,
  FileText,
  X,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Check,
  Copy,
} from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { htmlToText, getColorClasses, renderBlogContent } from "@/lib/utils";

interface DefinitiveArticleOverviewProps {
  post: BlogPost;
}

export function DefinitiveArticleOverview({
  post,
}: DefinitiveArticleOverviewProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const chapters = post.chapters || [];

  const totalReadTime = chapters.reduce((acc, chapter) => {
    return (
      acc +
      (chapter.posts?.reduce((postAcc, post) => {
        const readTime = parseInt(post.readTime?.replace(/\D/g, "") || "5");
        return postAcc + readTime;
      }, 0) || 0)
    );
  }, 0);

  // Handle scroll-based chapter detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = chapterRefs.current.length - 1; i >= 0; i--) {
        const element = chapterRefs.current[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveChapter(i);
          break;
        }
      }

      // Calculate reading progress
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const progress = (window.scrollY / documentHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToChapter = (index: number) => {
    const element = chapterRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">
          No chapters available
        </h3>
        <p className="text-slate-500 dark:text-slate-500">
          This definitive guide is still being prepared.
        </p>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;

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

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Guide Header */}
      <div className="border-b border-slate-200 ">
        <div className=" px-4 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Badge and Stats Row */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs md:text-sm font-medium">
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Definitive Guide</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{chapters.length} chapters</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>~{totalReadTime} min</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
                {htmlToText(post.excerpt)}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base overflow-hidden">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      post.author.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/authors/${post.author.slug}`}
                      className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm md:text-base"
                    >
                      {post.author.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                      <span>
                        Updated {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chapter Navigation Button */}
      <div className=" sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
        >
          <div className="flex items-center space-x-3">
            <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-slate-900 dark:text-white">
              Chapter {activeChapter + 1}: {chapters[activeChapter]?.title}
            </span>
          </div>
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {/* Mobile Chapter Menu */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-lg max-h-[60vh] overflow-y-auto">
            <div className="p-4 space-y-2">
              {chapters.map((chapter, index) => {
                const isActive = activeChapter === index;
                const chapterPosts = chapter.posts || [];

                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      scrollToChapter(index);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {chapter.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {chapterPosts.length} articles
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="px- py-6 md:py-8">
        <div className="space-y-12 md:space-y-16">
          {chapters.map((chapter, index) => {
            const chapterColors = getColorClasses(chapter.color);
            const chapterPosts = chapter.posts || [];

            return (
              <div
                key={chapter.id}
                ref={(el) => (chapterRefs.current[index] = el) as any}
                className="scroll-mt-24"
              >
                {/* Chapter Header */}
                <div className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg mb-6 md:mb-8">
                  <div
                    className={`bg-gradient-to-r ${chapterColors.bg} p-4 md:p-6`}
                  >
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-base md:text-lg text-white flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">
                          Chapter {index + 1}
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                          {chapter.title}
                        </h2>
                      </div>
                      {chapter.featured_image && (
                        <div className="hidden sm:block w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                          <img
                            src={chapter.featured_image}
                            alt={chapter.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {chapter.description && (
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>
                  )}

                  <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <div className="flex items-center space-x-3 md:space-x-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{chapterPosts.length} articles</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" />
                          <span>
                            ~
                            {chapterPosts.reduce((acc, post) => {
                              const readTime = parseInt(
                                post.readTime?.replace(/\D/g, "") || "5"
                              );
                              return acc + readTime;
                            }, 0)}{" "}
                            min
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-600 dark:text-slate-400 text-xs">
                          Ready to read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter Content (for chapters without posts, like Conclusion) */}
                {chapterPosts.length === 0 &&
                  (chapter.content || chapter.summary) && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm p-4 md:p-6">
                      <article
                        className="article-content max-w-none overflow-x-hidden break-words"
                        dangerouslySetInnerHTML={{
                          __html: renderBlogContent(
                            chapter.content || chapter.summary || ""
                          ),
                        }}
                      />
                    </div>
                  )}

                {/* Chapter Posts Content */}
                {chapterPosts.length > 0 && (
                  <div className="space-y-4 md:space-y-6">
                    {chapterPosts.map((chapterPost, postIndex) => (
                      <article
                        key={chapterPost.id}
                        className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                      >
                        {/* Post Header */}
                        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-start space-x-3 md:space-x-4">
                            <div
                              className={`w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br ${chapterColors.bg} rounded-md md:rounded-lg flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0`}
                            >
                              {postIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                                {chapterPost.title}
                              </h3>
                              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                {htmlToText(chapterPost.excerpt)}
                              </p>
                              <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-slate-500 dark:text-slate-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>{chapterPost.readTime}</span>
                                </div>
                                <div className="hidden sm:flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>
                                    {new Date(
                                      chapterPost.publishedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {chapterPost.image && (
                              <div className="hidden sm:block w-16 h-16 md:w-20 md:h-20 rounded-md md:rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                                <img
                                  src={chapterPost.image}
                                  alt={chapterPost.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-4 md:p-6">
                          {chapterPost.content ? (
                            <div
                              className="article-content max-w-none overflow-x-hidden break-words"
                              dangerouslySetInnerHTML={{
                                __html: renderBlogContent(chapterPost.content),
                              }}
                            />
                          ) : (
                            <div className="text-center py-6 md:py-8 text-slate-500 dark:text-slate-400">
                              <div className="max-w-sm mx-auto">
                                <BookOpen className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 opacity-50" />
                                <p className="font-medium mb-2 text-sm md:text-base">
                                  Content not available
                                </p>
                                <p className="text-xs md:text-sm mb-4">
                                  This chapter content is still being prepared.
                                </p>
                                <Link
                                  href={`/${chapterPost.slug}`}
                                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs md:text-sm font-medium"
                                >
                                  <span>Read Full Article</span>
                                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Completion Message */}
          <div className="text-center p-6 md:p-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white shadow-xl">
            <CheckCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Congratulations!
            </h3>
            <p className="text-base md:text-lg opacity-90">
              You've completed the "{post.title}" definitive guide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
