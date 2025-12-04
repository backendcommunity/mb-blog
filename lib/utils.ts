import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import hljs from "highlight.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function htmlToText(html?: string | null): string {
  const s = html || "";

  try {
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      const doc = new DOMParser().parseFromString(String(s), "text/html");
      return doc.body.textContent || "";
    }
  } catch (e) {}

  return String(s)
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function renderBlogContent(html: string): string {
  // Handle code blocks with language-specific syntax highlighting
  let processedHtml = html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      // Decode HTML entities in code
      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

      // Apply syntax highlighting with highlight.js
      let highlightedCode;
      try {
        if (lang && hljs.getLanguage(lang)) {
          highlightedCode = hljs.highlight(decodedCode, {
            language: lang,
          }).value;
        } else {
          highlightedCode = hljs.highlightAuto(decodedCode).value;
        }
      } catch (e) {
        highlightedCode = escapeHtml(decodedCode);
      }

      return `<div class="code-block-wrapper my-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50" data-code-block>
        <div class="code-block-header bg-[#1a2332] px-5 py-3.5 border-b border-slate-700/50">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer transition-colors shadow-sm"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer transition-colors shadow-sm"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer transition-colors shadow-sm"></div>
          </div>
        </div>
        <div class="bg-[#0d1117] px-6 py-6">
          <pre class="!my-0 !border-0 !shadow-none !rounded-none bg-transparent"><code class="hljs language-${lang} block overflow-x-auto text-[15px] leading-relaxed !rounded-none !bg-transparent" data-lang="${lang}">${highlightedCode}</code></pre>
        </div>
        <div class="code-block-footer bg-[#0d1117] px-6 py-3.5 border-t border-slate-800/50 flex items-center justify-end">
          <div class="text-sm">
            <span class="text-slate-400">Use our </span>
            <a href="https://playground.masteringbackend.com/javascript/?ref=masteringbackend&utm_source=masteringbackend&utm_medium=custom_code_editor&utm_campaign=blog-post" target="_blank" rel="noopener noreferrer" class="text-[#ff6b35] hover:text-[#ff8555] font-semibold transition-colors underline decoration-[#ff6b35]/30 hover:decoration-[#ff8555]">Online Code Editor</a>
          </div>
        </div>
      </div>`;
    }
  );

  // Handle bare <pre><code> blocks (no language class)
  processedHtml = processedHtml.replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (m, code) => {
      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

      // Apply auto-detection syntax highlighting
      let highlightedCode;
      try {
        highlightedCode = hljs.highlightAuto(decodedCode).value;
      } catch (e) {
        highlightedCode = escapeHtml(decodedCode);
      }

      return `<div class="code-block-wrapper my-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50" data-code-block>
        <div class="code-block-header bg-[#1a2332] px-5 py-3.5 border-b border-slate-700/50">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer transition-colors shadow-sm"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer transition-colors shadow-sm"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer transition-colors shadow-sm"></div>
          </div>
        </div>
        <div class="bg-[#0d1117] px-6 py-6">
          <pre class="!my-0 !border-0 !shadow-none !rounded-none bg-transparent"><code class="hljs block overflow-x-auto text-[15px] leading-relaxed !rounded-none !bg-transparent">${highlightedCode}</code></pre>
        </div>
        <div class="code-block-footer bg-[#0d1117] px-6 py-3.5 border-t border-slate-800/50 flex items-center justify-end">
          <div class="text-sm">
            <span class="text-slate-400">Use our </span>
            <a href="https://playground.masteringbackend.com/javascript/?ref=masteringbackend&utm_source=masteringbackend&utm_medium=custom_code_editor&utm_campaign=blog-post" target="_blank" rel="noopener noreferrer" class="text-[#ff6b35] hover:text-[#ff8555] font-semibold transition-colors underline decoration-[#ff6b35]/30 hover:decoration-[#ff8555]">Online Code Editor</a>
          </div>
        </div>
      </div>`;
    }
  );

  // Apply Tailwind classes to other HTML elements
  processedHtml = processedHtml
    .replace(
      /<h1/g,
      '<h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 leading-tight"'
    )
    .replace(
      /<h2/g,
      '<h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 leading-tight"'
    )
    .replace(
      /<h3/g,
      '<h3 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 leading-tight"'
    )
    .replace(
      /<h4/g,
      '<h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-3"'
    )
    .replace(
      /<h5/g,
      '<h5 class="text-base font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2"'
    )
    .replace(
      /<h6/g,
      '<h6 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-2"'
    )
    .replace(
      /<p>/g,
      '<p class="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6">'
    )
    .replace(
      /<a /g,
      '<a class="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 underline transition-colors" '
    )
    .replace(
      /<ul>/g,
      '<ul class="list-disc pl-6 mb-6 space-y-3 text-lg md:text-xl text-slate-700 dark:text-slate-300">'
    )
    .replace(
      /<ol>/g,
      '<ol class="list-decimal pl-6 mb-6 space-y-3 text-lg md:text-xl text-slate-700 dark:text-slate-300">'
    )
    .replace(/<li>/g, '<li class="mb-2">')
    .replace(
      /<blockquote>/g,
      '<blockquote class="border-l-4 border-[#13AECE] pl-6 py-4 my-8 text-lg md:text-xl text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 rounded-r-lg">'
    )
    .replace(
      /<code>/g,
      '<code class="bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded text-[#13AECE] dark:text-[#13AECE] text-sm font-mono">'
    )
    .replace(/<em>/g, '<em class="italic text-slate-700 dark:text-slate-300">')
    .replace(
      /<strong>/g,
      '<strong class="font-bold text-slate-900 dark:text-slate-100">'
    )
    .replace(/<img /g, '<img class="w-full rounded-lg shadow-lg my-6" ');

  // Handle tables
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

      return `<div class="article-table-wrapper leading-loose overflow-x-auto my-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl"><table${updatedAttrs}>`;
    })
    .replace(/<\/table>/g, "</table></div>");

  return processedHtml;
}

/**
 * Get color classes based on color name
 */
export function getColorClasses(color?: string) {
  switch (color?.toLowerCase()) {
    case "blue":
      return {
        bg: "from-blue-500 to-blue-600",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-600 dark:text-blue-400",
        accent: "bg-blue-50 dark:bg-blue-900/20",
        button: "bg-blue-600 hover:bg-blue-700",
      };
    case "green":
      return {
        bg: "from-green-500 to-green-600",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-600 dark:text-green-400",
        accent: "bg-green-50 dark:bg-green-900/20",
        button: "bg-green-600 hover:bg-green-700",
      };
    case "purple":
      return {
        bg: "from-purple-500 to-purple-600",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-600 dark:text-purple-400",
        accent: "bg-purple-50 dark:bg-purple-900/20",
        button: "bg-purple-600 hover:bg-purple-700",
      };
    case "red":
      return {
        bg: "from-red-500 to-red-600",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-600 dark:text-red-400",
        accent: "bg-red-50 dark:bg-red-900/20",
        button: "bg-red-600 hover:bg-red-700",
      };
    case "orange":
      return {
        bg: "from-orange-500 to-orange-600",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-600 dark:text-orange-400",
        accent: "bg-orange-50 dark:bg-orange-900/20",
        button: "bg-orange-600 hover:bg-orange-700",
      };
    default:
      return {
        bg: "from-[#13AECE] to-[#0891b2]",
        border: "border-[#13AECE]/20 dark:border-[#13AECE]/30",
        text: "text-[#13AECE]",
        accent: "bg-[#13AECE]/5 dark:bg-[#13AECE]/10",
        button: "bg-[#13AECE] hover:bg-[#0891b2]",
      };
  }
}
