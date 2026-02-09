"use client";

import { getYouTubeEmbedUrl } from "@/lib/utils";

/** Responsive YouTube video embed with cinematic styling. */
export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#111827]">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={embedUrl}
          title={`Watch: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
