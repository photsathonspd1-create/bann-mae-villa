"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/i18n";

type Campaign = {
  id: string;
  title: string;
  slug: string;
  content: string;
  bannerImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function CampaignPage() {
  const { locale } = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    fetch(`/api/campaigns/${slug}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Campaign not found or not active");
          }
          throw new Error("Failed to load campaign");
        }
        return res.json();
      })
      .then((data) => {
        setCampaign(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load campaign");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const shareCampaign = async () => {
    if (typeof window !== "undefined" && campaign) {
      const url = window.location.href;
      const title = campaign.title;
      
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch (err) {
          // Fallback to copying to clipboard
          copyToClipboard(url);
        }
      } else {
        copyToClipboard(url);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Campaign Not Found</h1>
          <p className="text-neutral-400 mb-8">{error || "This campaign may not exist or is no longer active."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Banner */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={campaign.bannerImage}
          alt={campaign.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Navigation */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-white backdrop-blur-sm hover:bg-black/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {/* Share Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={shareCampaign}
            className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-white backdrop-blur-sm hover:bg-black/60"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        {/* Campaign Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-light text-white mb-4">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(campaign.createdAt).toLocaleDateString(
                    locale === "th" ? "th-TH" : locale === "cn" ? "zh-CN" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-8 md:p-12">
            <div 
              className="text-white leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: campaign.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-8">
            <h2 className="text-2xl font-playfair font-light text-white mb-4">
              Interested in this promotion?
            </h2>
            <p className="text-neutral-400 mb-8">
              Contact us to learn more about this special offer or to schedule a viewing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-amber-400"
              >
                Contact Us
              </Link>
              <Link
                href="/villas"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-400/50 bg-amber-400/10 px-6 py-3 text-sm font-medium text-amber-400 backdrop-blur-sm transition-all hover:bg-amber-400 hover:text-neutral-950"
              >
                View Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
