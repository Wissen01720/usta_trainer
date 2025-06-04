export interface Prerequisite {
  type: 'lesson' | 'exercise';
  id: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  difficulty_level?: string;
  thumbnail_url?: string;
  video_url?: string;
  estimated_duration?: number;
  prerequisites?: Prerequisite[];
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}