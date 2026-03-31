export type Language = 'zh' | 'en';

export interface SprintContent {
  [key: string]: string;
}

export interface DailyLog {
  date: string;
  done: string;
  plan: string;
  block: string;
  aiInsight: string;
}

export interface BacklogItem {
  text: string;
  priority: 'high' | 'med' | 'low';
}

export interface Version {
  time: string;
  label: string;
  snapshot: string;
}

export interface SprintData {
  planning: {
    goal: string;
    tasks: string;
    aiOutput: string;
  };
  dailyScrum: DailyLog[];
  review: {
    summary: string;
    aiOutput: string;
    qa: number[];
  };
  retro: {
    worked: string;
    didnt: string;
    improvements: string;
    aiOutput: string;
  };
  backlog: {
    items: BacklogItem[];
    aiOutput: string;
  };
  content: SprintContent & { aiOutput?: string };
  versions: Version[];
}

export interface AppState {
  researchTitle: string;
  completedSprints: number[];
  sprints: { [key: number]: SprintData };
}

export interface SprintDefinition {
  id: number;
  zh: { title: string; sub: string };
  en: { title: string; sub: string };
  color: string;
  icon: string;
  content_fields: ContentField[];
}

export interface ContentField {
  key: string;
  zh: string;
  en: string;
  type: 'text' | 'textarea' | 'select';
  placeholder_zh?: string;
  placeholder_en?: string;
  options_zh?: string[];
  options_en?: string[];
}
