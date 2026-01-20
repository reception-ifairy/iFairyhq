import type React from 'react';
import { Award, Brain, Gem, Zap } from 'lucide-react';

export type CurriculumKey = {
  title: string;
  era: string;
  focus: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  glow: string;
};

export const curriculumKeys: CurriculumKey[] = [
  {
    title: 'Key Stage 1',
    era: 'Ages 5-7',
    focus: 'Discovery Patterns',
    desc: 'Narrative patterns focusing on identifying, naming, and simple classification through story-based inquiry.',
    icon: Gem,
    color: 'text-blue-400',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.3)]',
  },
  {
    title: 'Key Stage 2',
    era: 'Ages 7-11',
    focus: 'Logical Inquiry',
    desc: 'Fair testing, hypothesis formation, and data-led conclusions within epic adventure arcs.',
    icon: Zap,
    color: 'text-amber-400',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
  },
  {
    title: 'Key Stage 3',
    era: 'Ages 11-14',
    focus: 'Critical Analysis',
    desc: 'Deep-dives into complex ethics, advanced physics, and historical interpretations using narrative logic.',
    icon: Brain,
    color: 'text-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  },
  {
    title: 'Key Stage 4',
    era: 'Ages 14-16',
    focus: 'Mastery & Paths',
    desc: 'Specialised mentoring preparing students for advanced certifications through project-based mastery.',
    icon: Award,
    color: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
  },
];

