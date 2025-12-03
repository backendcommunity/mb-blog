"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { getColorClasses } from "@/lib/utils";

interface SideNewsletterProps {
  color?: string;
}

export function SideNewsletter({ color }: SideNewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colorClasses = getColorClasses(color);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
        <div className={`${colorClasses.accent} border rounded-2xl p-6 shadow-2xl max-w-sm backdrop-blur-xl`}>
          <div className="text-center">
            <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Thank you!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You've successfully subscribed to our newsletter. Check your email for confirmation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
      <div className="bg-white dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm">
        <div className="text-center mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Get the latest backend engineering insights delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13AECE] focus:border-transparent transition-all"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${colorClasses.button} text-white px-4 py-3 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 text-center">
          No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
