export const APP_CONFIG_STORAGE_KEY = 'ifairy:appConfig:v1';

export type FrontpageSectionId = 'intro' | 'purpose' | 'about' | 'archive' | 'vision' | 'mission';

export type FrontpageCta = {
  title: string;
  label: string;
  scrollTo?: string;
  href?: string;
};

export type FrontpageSectionBase = {
  enabled: boolean;
};

export type FrontpageConfig = {
  intro: FrontpageSectionBase & {
    badgeText: string;
    headingLine1: string;
    headingEmphasis: string;
    headingLine2: string;
    headingAccent: string;
    description: string;
    ctas: FrontpageCta[];
    scrollHint: string;
  };
  purpose: FrontpageSectionBase & {
    pillText: string;
    headingLine1: string;
    headingEmphasis: string;
    quote: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  about: FrontpageSectionBase & {
    eyebrow: string;
    headingLine1: string;
    headingEmphasis: string;
    quote: string;
    description: string;
    features: { title: string; text: string }[];
  };
  archive: FrontpageSectionBase & {
    eyebrow: string;
    headingLine1: string;
    headingEmphasis: string;
    description: string;
  };
  vision: FrontpageSectionBase & {
    eyebrow: string;
    headingLine1: string;
    headingEmphasis: string;
    description: string;
    bullets: string[];
  };
  mission: FrontpageSectionBase & {
    eyebrow: string;
    headingLine1: string;
    headingEmphasis: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
  };
};

export type AiChatConfig = {
  model: string;
  systemInstruction: string;
  temperature: number;
};

export type AiDreamConfig = {
  model: string;
  systemInstruction: string;
  temperature: number;
};

export type AiConfig = {
  geminiApiKey?: string;
  chat: AiChatConfig;
  dream: AiDreamConfig;
};

export type AppConfig = {
  version: 1;
  frontpage: FrontpageConfig;
  ai: AiConfig;
};

export const defaultAppConfig: AppConfig = {
  version: 1,
  frontpage: {
    intro: {
      enabled: true,
      badgeText: 'UK National Curriculum Aligned — Empowering Home Mastery',
      headingLine1: 'Harmonious',
      headingEmphasis: 'Education.',
      headingLine2: 'Expert',
      headingAccent: 'Academy Spirits.',
      description:
        'iFairy Studio merges rigorous pedagogy, ethical AI, and epic storytelling. We deliver UK curriculum-aligned tools designed for the modern era of self-led mastery.',
      ctas: [
        { title: 'UK Standards Archive', label: 'View Mapping', scrollTo: 'archive' },
        { title: 'Academy Alpha Pilot', label: 'Start Learning', scrollTo: 'purpose' },
        { title: 'Home Learning Guild', label: 'Join Community', scrollTo: 'mission' },
      ],
      scrollHint: 'Explore the Foundation',
    },
    purpose: {
      enabled: true,
      pillText: 'Universal Right',
      headingLine1: 'Knowledge',
      headingEmphasis: 'Infinite.',
      quote:
        '“To end the era where a child’s question echoes into silence, providing 24/7 UK Curriculum-aligned guidance for every home-learning environment.”',
      description:
        'We replace isolation with expert Academy Guardians. Our tools ensure that whether a child is in a classroom or a quiet village, they receive the highest quality of individualised instruction.',
      primaryCtaLabel: 'Read Manifesto',
      secondaryCtaLabel: 'Consult Core',
    },
    about: {
      enabled: true,
      eyebrow: 'Brand Manifesto',
      headingLine1: 'Where every child',
      headingEmphasis: 'soars.',
      quote: '“Expert mentoring for home mastery.\nFull Curriculum alignment for UK Standards.\nThe future of Edutainment.”',
      description:
        'iFairy Studio is a movement for equal opportunity, ensuring every child can navigate their unique learning journey with an organic Academy Spirit by their side.',
      features: [
        {
          title: 'Adaptive Academy Mentors',
          text: 'Our living educational spirits guide children through Key Stages 1-4 with logic and empathy, ensuring no subject remains unexplored.',
        },
        {
          title: 'Visual Narrative Assets',
          text: 'Thousands of UK-aligned learning visuals and edutainment projects. We cloak dry facts in epic adventures.',
        },
        {
          title: 'Academic Melodies',
          text: 'Turning complex science and math concepts into songs. Procedural music that reacts to the child’s pace and emotional state.',
        },
        {
          title: 'Safeguarding Lighthouses',
          text: 'Rigorous child-protection ethics built into our ecosystem. A safe, ad-free haven for families and private tutors.',
        },
      ],
    },
    archive: {
      enabled: true,
      eyebrow: 'The Academy Archive',
      headingLine1: 'Curriculum',
      headingEmphasis: 'Keys.',
      description: 'Detailed mapping of our narrative inquiry approach to the UK educational framework.',
    },
    vision: {
      enabled: true,
      eyebrow: 'The Vision',
      headingLine1: 'Edutainment',
      headingEmphasis: 'that adapts.',
      description:
        'A studio where narrative, curriculum mapping, and safeguarding standards are woven into a single home-learning experience.',
      bullets: [
        'Key Stage aligned Academy Spirits (KS1–KS4)',
        'Narrative Inquiry lessons and projects',
        'Ethical, child-safe design (AUREN Safety Core)',
        'Tools for parents, tutors, and microschools',
      ],
    },
    mission: {
      enabled: true,
      eyebrow: 'The Mission',
      headingLine1: 'Ship',
      headingEmphasis: 'the Lighthouse.',
      description:
        'Bring reliable, curriculum-aligned guidance to every home-learning environment — without ads, without data-harvesting, and without compromise.',
      primaryCtaLabel: 'Contact',
      primaryCtaHref: 'mailto:hello@ifairy.co.uk',
    },
  },
  ai: {
    geminiApiKey: '',
    chat: {
      model: 'gemini-3-pro-preview',
      systemInstruction:
        `You are the magical, empathetic, and wise AI guide of iFairy Studio's Lighthouse Support.\n` +
        `Your tone is "Modern Dark Fantasy" — nurturing, professional, and laced with wonder.\n` +
        `You specialize in explaining how iFairy Studio supports home-learning families and UK National Curriculum alignment.\n` +
        `Key concepts:\n` +
        `1. Purpose: Equal access to humanity's knowledge.\n` +
        `2. Academy Spirits: Our AI tutors (Living Educational Guardians). Never use artificial words like "bionic".\n` +
        `3. Homeschooling: We prefer terms like "Home-led Mastery" or "Domestic Academy".\n` +
        `4. Safety: We use the AUREN Safety Core for ethical, child-safe interactions. We never collect data on children.\n` +
        `Keep answers concise (max 3 sentences) and inspiring.`,
      temperature: 0.7,
    },
    dream: {
      model: 'gemini-3-flash-preview',
      systemInstruction:
        `You are the "Creatoryx Engine" of iFairy Studio.\n` +
        `Manifest a short, magical learning scenario (max 80 words).\n` +
        `RULES:\n` +
        `1. Alignment: Must align with UK National Curriculum standards for the given year.\n` +
        `2. Approach: Use Narrative Inquiry (e.g., a "mystery" or "expedition" context).\n` +
        `3. Imagery: Use Dark Fantasy / Magical imagery.\n` +
        `4. No AI Labels: Do not use words like "bionic", "robotic", or "artificial".\n` +
        `5. Structure: Provide a 'Story Hook' and a 'Scientific/Academic Objective'.\n` +
        `6. Privacy: Focus on the lore, not a specific child.`,
      temperature: 1.0,
    },
  },
};

const isRecord = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

const clampNumber = (val: unknown, min: number, max: number, fallback: number) => {
  const num = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
};

const mergeConfig = <T extends Record<string, any>>(base: T, patch: any): T => {
  if (!isRecord(patch)) return base;
  const out: Record<string, any> = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (!(key in base)) continue;
    const baseVal = (base as any)[key];
    if (Array.isArray(baseVal)) {
      out[key] = Array.isArray(value) ? value : baseVal;
      continue;
    }
    if (isRecord(baseVal) && isRecord(value)) {
      out[key] = mergeConfig(baseVal, value);
      continue;
    }
    out[key] = value;
  }
  return out as T;
};

export const getGeminiApiKey = (config?: AppConfig): string => {
  const fromConfig = config?.ai?.geminiApiKey?.trim();
  if (fromConfig) return fromConfig;
  const fromBuild = (process.env.API_KEY || '').trim();
  if (fromBuild && fromBuild !== 'PLACEHOLDER_API_KEY') return fromBuild;
  return '';
};

export const loadAppConfig = (): AppConfig => {
  if (typeof window === 'undefined') return defaultAppConfig;
  try {
    const raw = window.localStorage.getItem(APP_CONFIG_STORAGE_KEY);
    if (!raw) return defaultAppConfig;
    const parsed = JSON.parse(raw);
    const merged = mergeConfig(defaultAppConfig, parsed);
    merged.ai.chat.temperature = clampNumber(merged.ai.chat.temperature, 0, 2, defaultAppConfig.ai.chat.temperature);
    merged.ai.dream.temperature = clampNumber(merged.ai.dream.temperature, 0, 2, defaultAppConfig.ai.dream.temperature);
    return merged;
  } catch {
    return defaultAppConfig;
  }
};

export const saveAppConfig = (config: AppConfig) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(APP_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const resetAppConfig = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(APP_CONFIG_STORAGE_KEY);
};

export const redactAppConfigForExport = (config: AppConfig): AppConfig => ({
  ...config,
  ai: {
    ...config.ai,
    geminiApiKey: '',
  },
});

