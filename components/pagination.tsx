"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /**
   * Callback mode — renders <button>. Fine for in-page state, but the pages it
   * produces have no URL, so crawlers cannot reach them.
   */
  onPageChange?: (page: number) => void;
  /**
   * Link mode — renders <a href>. Prefer this: it gives every page a real,
   * crawlable, shareable URL. Takes precedence over onPageChange.
   */
  buildHref?: (page: number) => string;
  className?: string;
}

const baseNav =
  "inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm focus:outline-none focus:ring-2 focus:ring-[#13AECE]";
const enabledNav =
  "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700";
const disabledNav =
  "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700";

const pageBase = "px-3 py-2 rounded-md text-sm font-medium transition-all shadow-sm";
const pageActive =
  "bg-gradient-to-r from-[#13AECE] to-[#0891b2] text-white shadow-lg border-transparent";
const pageIdle =
  "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  buildHref,
  className = "",
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  // Link mode: real anchors, so pagination is crawlable and shareable.
  const renderNav = (page: number, disabled: boolean, label: string, icon: "prev" | "next") => {
    const content = (
      <>
        {icon === "prev" && <ChevronLeft className="w-4 h-4" />}
        <span>{label}</span>
        {icon === "next" && <ChevronRight className="w-4 h-4" />}
      </>
    );

    if (disabled) {
      return (
        <span className={`${baseNav} ${disabledNav}`} aria-disabled="true">
          {content}
        </span>
      );
    }

    if (buildHref) {
      return (
        <Link
          href={buildHref(page)}
          rel={icon === "prev" ? "prev" : "next"}
          className={`${baseNav} ${enabledNav}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button onClick={() => onPageChange?.(page)} className={`${baseNav} ${enabledNav}`}>
        {content}
      </button>
    );
  };

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-3 py-6 ${className}`}
      aria-label="Pagination"
    >
      {renderNav(currentPage - 1, prevDisabled, "Previous", "prev")}

      {visiblePages.map((page, index) => (
        <div key={`${page}-${index}`}>
          {page === "..." ? (
            <span className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">
              ...
            </span>
          ) : buildHref ? (
            <Link
              href={buildHref(page as number)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`${pageBase} ${currentPage === page ? pageActive : pageIdle}`}
            >
              {page}
            </Link>
          ) : (
            <button
              onClick={() => onPageChange?.(page as number)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`${pageBase} ${currentPage === page ? pageActive : pageIdle}`}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      {renderNav(currentPage + 1, nextDisabled, "Next", "next")}
    </nav>
  );
}
