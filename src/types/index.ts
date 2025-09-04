export interface Workspace {
  id: string; // UUID
  name: string;
  initials: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleSlot {
  id: string; // UUID
  workspace_id: string; // UUID
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  time_of_day: string; // TIME format
  category: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface DraftIdea {
  id: string; // UUID
  workspace_id: string; // UUID
  type: 'draft' | 'idea';
  text: string;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string; // UUID
  workspace_id: string; // UUID
  schedule_slot_id: string | null; // UUID or null
  content_category_id: string | null; // UUID or null
  text: string | null;
  media_url: string | null;
  template: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_at: string | null; // TIMESTAMP
  published_at: string | null; // TIMESTAMP
  created_at?: string;
  updated_at?: string;
}

export interface ContentCategory {
  id: string; // UUID
  workspace_id: string; // UUID
  name: string;
  description: string | null;
  is_evergreen: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AutomationSettings {
  id: string; // UUID
  workspace_id: string; // UUID
  evergreen: boolean;
  top_performers: boolean;
  repost_to_story: boolean;
  created_at?: string;
  updated_at?: string;
}

// UI-specific types
export interface ScheduleSlotUI extends ScheduleSlot {
  day: string; // Human-readable day name
  time: string; // Human-readable time
}