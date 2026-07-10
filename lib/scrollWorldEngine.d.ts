// Minimal types for the vanilla scroll-world engine (scrub-engine.js).

export interface ScrollWorldSection {
  id: string;
  label: string;
  still?: string;
  clip?: string;
  clipMobile?: string;
  accent?: string;
  scroll?: number;
  linger?: number;
  eyebrow?: string;
  title?: string;
  body?: string;
  tags?: string[];
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
}

export interface ScrollWorldConfig {
  brand?: { name: string; href?: string };
  hint?: string;
  nav?: boolean;
  atmosphere?: boolean;
  diveScroll?: number;
  connScroll?: number;
  crossfade?: number;
  cta?: { label: string; href: string };
  sections: ScrollWorldSection[];
  connectors?: (string | null)[];
  connectorsMobile?: (string | null)[];
}

export function mountScrollWorld(container: HTMLElement, config: ScrollWorldConfig): void;
