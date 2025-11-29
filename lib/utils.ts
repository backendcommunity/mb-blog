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
  // First, handle code blocks with language headers
  let processedHtml = html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      return `<div class="code-block-wrapper my-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
        <div class="code-block-header bg-slate-800 dark:bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <span class="text-slate-300 text-sm font-mono">${lang}</span>
          <button onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').textContent)" class="text-slate-400 hover:text-white text-sm transition-colors">Copy</button>
        </div>
        <pre class="!my-0 !border-0 !shadow-none !rounded-none"><code class="language-${lang} block bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white p-6 overflow-x-auto text-sm md:text-base leading-relaxed font-mono !rounded-none">${code}</code></pre>
      </div>`;
    }
  );

  return processedHtml
    .replace(/<h1/g, '<h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 leading-tight"')
    .replace(/<h2/g, '<h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 leading-tight"')
    .replace(/<h3/g, '<h3 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 leading-tight"')
    .replace(/<h4/g, '<h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-3"')
    .replace(/<h5/g, '<h5 class="text-base font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2"')
    .replace(/<h6/g, '<h6 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-2"')
    .replace(/<p>/g, '<p class="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-6">')
    .replace(/<a /g, '<a class="text-[#13AECE] hover:text-[#13AECE]/80 underline transition-colors" ')
    .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-6 space-y-2 text-base md:text-lg text-slate-700 dark:text-slate-300">')
    .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-6 space-y-2 text-base md:text-lg text-slate-700 dark:text-slate-300">')
    .replace(/<li>/g, '<li class="ml-2">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-[#13AECE] pl-4 py-2 my-6 text-base md:text-lg text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 px-4 rounded">')
    .replace(/<code>/g, '<code class="bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded text-[#13AECE] dark:text-[#13AECE] text-sm font-mono">')
    .replace(/<em>/g, '<em class="italic text-slate-700 dark:text-slate-300">')
    .replace(/<strong>/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">')
    .replace(/<table>/g, '<table class="w-full border-collapse border border-slate-300 dark:border-slate-600 my-6">')
    .replace(/<thead>/g, '<thead class="bg-slate-100 dark:bg-slate-800">')
    .replace(/<th>/g, '<th class="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">')
    .replace(/<td>/g, '<td class="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-600 dark:text-slate-400">')
    .replace(/<img /g, '<img class="w-full rounded-lg shadow-lg my-6" ');
}
