"use client";

import { useState } from "react";
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Check,
  Link as LinkIcon,
} from "lucide-react";

interface ShareBoxProps {
  title: string;
  url?: string;
}

export function ShareBox({ title, url }: ShareBoxProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = (platform: string) => {
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title + " @master_backend"
          )}&url=${encodeURIComponent(currentUrl)}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            currentUrl
          )}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-white dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4">
        <div className="flex flex-col space-y-3">
          <div className="text-center mb-2">
            <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Share
            </p>
          </div>

          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all hover:scale-110 group"
            title="Share on Twitter"
          >
            <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => handleShare("linkedin")}
            className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all hover:scale-110 group"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => handleShare("facebook")}
            className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all hover:scale-110 group"
            title="Share on Facebook"
          >
            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => handleShare("copy")}
            className="flex items-center justify-center w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-110 group"
            title="Copy Link"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
            ) : (
              <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
