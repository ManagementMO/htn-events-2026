import type { TEvent } from "./types";

export type TBrandVisual = {
  src: string;
  alt: string;
  className: string;
};

type TBrandVisualRule = {
  id: string;
  matchTerms: readonly string[];
  visual: TBrandVisual;
};

/**
 * Brand-fallback rules for sponsor/company events that often have no profile image.
 *
 * To add a new brand:
 * 1. Add an SVG in `public/brand-logos/`.
 * 2. Add one rule with 1+ `matchTerms` (speaker name and/or event title keywords).
 * 3. Reuse existing gradient classes or define a new one in `className`.
 */
const BRAND_VISUAL_RULES: readonly TBrandVisualRule[] = [
  {
    id: "firebase",
    matchTerms: ["firebase"],
    visual: {
      src: "/brand-logos/firebase.svg",
      alt: "Firebase logo",
      className: "bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-yellow-500/10 border-amber-400/30",
    },
  },
  {
    id: "microsoft",
    matchTerms: ["microsoft", "azure"],
    visual: {
      src: "/brand-logos/microsoft.svg",
      alt: "Microsoft logo",
      className: "bg-gradient-to-br from-sky-500/20 via-cyan-500/15 to-blue-500/10 border-sky-400/30",
    },
  },
  {
    id: "hootsuite",
    matchTerms: ["hootsuite"],
    visual: {
      src: "/brand-logos/hootsuite.svg",
      alt: "Hootsuite logo",
      className: "bg-gradient-to-br from-orange-500/20 via-rose-500/15 to-red-500/10 border-orange-400/30",
    },
  },
  {
    id: "vonage",
    matchTerms: ["vonage"],
    visual: {
      src: "/brand-logos/vonage.svg",
      alt: "Vonage logo",
      className: "bg-gradient-to-br from-purple-500/20 via-violet-500/15 to-indigo-500/10 border-purple-400/30",
    },
  },
  {
    id: "voiceflow",
    matchTerms: ["voiceflow"],
    visual: {
      src: "/brand-logos/voiceflow.svg",
      alt: "Voiceflow logo",
      className: "bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-sky-500/10 border-blue-400/30",
    },
  },
] as const;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function buildEventLookupText(event: TEvent): string {
  const speakerNames = event.speakers.map((speaker) => speaker.name).join(" ");
  return normalize(`${event.name} ${speakerNames}`);
}

export function getEventBrandVisual(event: TEvent): TBrandVisual | null {
  const lookupText = buildEventLookupText(event);

  const matchedRule = BRAND_VISUAL_RULES.find((rule) =>
    rule.matchTerms.some((term) => lookupText.includes(normalize(term)))
  );

  return matchedRule?.visual ?? null;
}
