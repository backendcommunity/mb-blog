import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert HTML string to plain text. Uses DOMParser in the browser when available
 * for more accurate handling of entities; falls back to a simple tag-stripping
 * regex (useful in SSR/Node environments).
 */
export function htmlToText(html?: string | null): string {
  const s = html || "";

  try {
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      const doc = new DOMParser().parseFromString(String(s), "text/html");
      return doc.body.textContent || "";
    }
  } catch (e) {
    // swallow and fallback to regex
  }

  return String(s).replace(/<[^>]*>/g, "").trim();
}

/**
 * Render HTML content with Tailwind styles applied inline.
 * Injects classes into HTML tags for consistent typography.
 */
export function renderBlogContent(html: string): string {
  // First, handle code blocks with Apple-style window header
  let processedHtml = html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      return `<div class="code-block-wrapper my-8 rounded-xl overflow-hidden shadow-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div class="code-block-header bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-slate-300 text-xs font-medium ml-3 uppercase tracking-wider">${lang}</span>
          </div>
          <button onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').textContent.trim()); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);" class="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-all border border-slate-700 hover:bg-slate-700">Copy</button>
        </div>
        <pre class="!my-0 !border-0 !shadow-none !rounded-none bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"><code class="language-${lang} block text-slate-100 p-6 overflow-x-auto text-sm md:text-base leading-relaxed font-mono !rounded-none">${code}</code></pre>
      </div>`;
    }
  );

  // Handle bare <pre><code> blocks (no language class) and make their text high-contrast (white)
  processedHtml = processedHtml.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (m, code) => {
    return `<div class="code-block-wrapper my-8 rounded-xl overflow-hidden shadow-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div class="code-block-header bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-slate-300 text-xs font-medium ml-3 uppercase tracking-wider">code</span>
          </div>
          <button onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').textContent.trim()); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);" class="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-all border border-slate-700 hover:bg-slate-700">Copy</button>
        </div>
        <pre class="!my-0 !border-0 !shadow-none !rounded-none bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"><code class="block text-white p-6 overflow-x-auto text-sm md:text-base leading-relaxed font-mono !rounded-none">${code}</code></pre>
      </div>`;
  });

  processedHtml = processedHtml
    .replace(/<h1/g, '<h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 leading-tight"')
    .replace(/<h2/g, '<h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 leading-tight"')
    .replace(/<h3/g, '<h3 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 leading-tight"')
    .replace(/<h4/g, '<h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-3"')
    .replace(/<h5/g, '<h5 class="text-base font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2"')
    .replace(/<h6/g, '<h6 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-2"')
    .replace(/<p>/g, '<p class="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-6">')
    .replace(/<a /g, '<a class="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 underline transition-colors" ')
    .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-6 space-y-3 text-lg md:text-xl text-slate-700 dark:text-slate-300">')
    .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-6 space-y-3 text-lg md:text-xl text-slate-700 dark:text-slate-300">')
    .replace(/<li>/g, '<li class="mb-2">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-[#13AECE] pl-6 py-4 my-8 text-lg md:text-xl text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 rounded-r-lg">')
    .replace(/<code>/g, '<code class="bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded text-[#13AECE] dark:text-[#13AECE] text-sm font-mono">')
    .replace(/<em>/g, '<em class="italic text-slate-700 dark:text-slate-300">')
    .replace(/<strong>/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">')
    .replace(/<img /g, '<img class="w-full rounded-lg shadow-lg my-6" ');

  processedHtml = processedHtml
    .replace(/<table([^>]*)>/g, (_match, attrs = "") => {
      let updatedAttrs = attrs;
      const classMatch = attrs.match(/class="([^"]*)"/);
      if (classMatch) {
        if (!classMatch[1].includes("article-table")) {
          updatedAttrs = updatedAttrs.replace(
            classMatch[0],
            `class="${`${classMatch[1]} article-table`.trim()}"`
          );
        }
      } else {
        updatedAttrs = `${updatedAttrs} class="article-table"`;
      }

      return `<div class="article-table-wrapper overflow-x-auto my-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl"><table${updatedAttrs}>`;
    })
    .replace(/<\/table>/g, "</table></div>");

  return processedHtml;
}
