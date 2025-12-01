import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import Header from "@/components/header";
import { BlogList } from "@/components/blog-list";
import { getPosts, getStickyPosts } from "@/lib/strapi";
import type { BlogPost } from "@/lib/types";

// Extract unique categories from posts
function extractCategories(posts: BlogPost[]): string[] {
  const categories = new Set<string>();
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  return ["All", ...Array.from(categories).sort()];
}

export default async function Home() {
  const [postsResponse, featuredPosts] = await Promise.all([
    getPosts({ page: 1, count: 1000 }),
    getStickyPosts(),
  ]);

  const allPosts = postsResponse.posts;
  const categories = extractCategories(allPosts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 font-sans">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Square-grid hero background (uses primary color as base) */}
        <div className="absolute inset-0 hero-grid-bg pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Welcome to Masteringbackend</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            The Backend
            <span className="bg-gradient-to-r from-[#13AECE] to-[#0891b2] bg-clip-text text-transparent"> Chronicles</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto mb-12 leading-relaxed">
            Mastering the art of server-side engineering. Deep dives into system design, 
            databases, and scalable architecture.
          </p>

        </div>
      </section>

      <BlogList
        initialPosts={allPosts}
        initialFeaturedPosts={featuredPosts}
        categories={categories}
      />

      {/* Newsletter Signup */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6IiBzdHJva2U9InJnYmEoMTksIDE3NCwgMjA2LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Stay Ahead of the Curve
          </h2>
          <p className="text-slate-700 dark:text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
            Get the latest backend engineering articles, system design tutorials, and industry insights
            delivered to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#13AECE] focus:border-transparent transition-all dark:bg-white/5 dark:border-white/10 dark:text-white"
            />
            <button className="bg-[#13AECE] text-white px-8 py-4 rounded-xl hover:bg-[#13AECE]/90 transition-colors whitespace-nowrap font-semibold shadow-lg shadow-[#13AECE]/25">
              Subscribe Now
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            Join 15,000+ backend engineers. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="https://masteringbackend.com">
            <BrandLogo size="sm" variant="default" />
          </Link>
            <div className="flex items-center space-x-6">
                <a
                  href="https://github.com/backendcommunity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-[#13AECE] transition-colors"
                  aria-label="Masteringbackend on GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/master_backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-[#13AECE] transition-colors"
                  aria-label="Masteringbackend on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/masteringbackend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-[#13AECE] transition-colors"
                  aria-label="Masteringbackend on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
            </div>
            <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Masteringbackend. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}
