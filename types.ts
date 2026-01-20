
export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  text: string;
}

export enum Section {
  Intro = 'intro',
  Purpose = 'purpose',
  About = 'about',
  Archive = 'archive',
  Vision = 'vision',
  Mission = 'mission'
}
