import { Post, DraftIdea, Workspace, ScheduleSlot, AutomationSettings } from '@/types';

// Define the structure of our local database
interface LocalDB {
  workspaces: Workspace[];
  posts: Record<string, Post>;
  draftsAndIdeas: DraftIdea[];
  masterSchedule: ScheduleSlot[];
  automationSettings: AutomationSettings;
  createdAt: string;
  updatedAt: string;
}

// Default data structure
const DEFAULT_DB: LocalDB = {
  workspaces: [
    { id: 1, name: 'Innovate Corp', initials: 'IC', color: 'bg-indigo-500' },
    { id: 2, name: 'Sunrise Coffee', initials: 'SC', color: 'bg-amber-500' }
  ],
  posts: {},
  draftsAndIdeas: [
    {id: 101, type: 'draft', text: 'The future of B2B marketing is community-led. Here’s why...'},
    {id: 102, type: 'draft', text: 'Our latest case study with Acme Corp shows a 300% increase in lead generation.'},
    {id: 201, type: 'idea', text: 'A thread about the importance of brand voice.'},
    {id: 202, type: 'idea', text: 'A quick tip video for productivity.'}
  ],
  masterSchedule: [
    { id: 1, day: 'Mondays', time: '09:00 AM', category: 'Industry News', color: 'text-sky-300' },
    { id: 2, day: 'Tuesdays', time: '02:00 PM', category: 'Product Updates', color: 'text-indigo-300' },
    { id: 3, day: 'Wednesdays', time: '11:00 AM', category: 'Evergreen Tips', color: 'text-emerald-300' },
    { id: 4, day: 'Thursdays', time: '04:00 PM', category: 'Case Studies', color: 'text-amber-300' },
    { id: 5, day: 'Fridays', time: '10:00 AM', category: 'Company Culture', color: 'text-rose-300' },
  ],
  automationSettings: {
    evergreen: true,
    topPerformers: false,
    repostToStory: false
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Get the database file path
const getDBPath = () => {
  if (typeof window !== 'undefined') {
    // In browser environment, use localStorage
    return null;
  }
  // In Node.js environment, use a file
  return '/tmp/zenith-local-db.json';
};

// Load database from storage
export const loadDB = (): LocalDB => {
  if (typeof window !== 'undefined') {
    // Browser environment - use localStorage
    try {
      const data = localStorage.getItem('zenith-db');
      return data ? JSON.parse(data) : DEFAULT_DB;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return DEFAULT_DB;
    }
  } else {
    // Server environment - use file system
    try {
      const fs = require('fs');
      const path = require('path');
      const dbPath = getDBPath();
      
      if (dbPath && fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
      }
      return DEFAULT_DB;
    } catch (error) {
      console.error('Error loading from file:', error);
      return DEFAULT_DB;
    }
  }
};

// Save database to storage
export const saveDB = (db: LocalDB): void => {
  const updatedDB = {
    ...db,
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    // Browser environment - use localStorage
    try {
      localStorage.setItem('zenith-db', JSON.stringify(updatedDB));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  } else {
    // Server environment - use file system
    try {
      const fs = require('fs');
      const dbPath = getDBPath();
      
      if (dbPath) {
        fs.writeFileSync(dbPath, JSON.stringify(updatedDB, null, 2));
      }
    } catch (error) {
      console.error('Error saving to file:', error);
    }
  }
};

// Initialize the database
export const initDB = (): LocalDB => {
  const db = loadDB();
  // Ensure all required fields exist
  const validatedDB = {
    ...DEFAULT_DB,
    ...db,
    workspaces: db.workspaces || DEFAULT_DB.workspaces,
    draftsAndIdeas: db.draftsAndIdeas || DEFAULT_DB.draftsAndIdeas,
    masterSchedule: db.masterSchedule || DEFAULT_DB.masterSchedule,
    automationSettings: db.automationSettings || DEFAULT_DB.automationSettings
  };
  saveDB(validatedDB);
  return validatedDB;
};

// Database operations
export const getWorkspaces = (): Workspace[] => {
  const db = loadDB();
  return db.workspaces;
};

export const getPosts = (): Record<string, Post> => {
  const db = loadDB();
  return db.posts;
};

export const getDraftsAndIdeas = (): DraftIdea[] => {
  const db = loadDB();
  return db.draftsAndIdeas;
};

export const getMasterSchedule = (): ScheduleSlot[] => {
  const db = loadDB();
  return db.masterSchedule;
};

export const getAutomationSettings = (): AutomationSettings => {
  const db = loadDB();
  return db.automationSettings;
};

export const updatePosts = (posts: Record<string, Post>): void => {
  const db = loadDB();
  db.posts = posts;
  saveDB(db);
};

export const updateDraftsAndIdeas = (draftsAndIdeas: DraftIdea[]): void => {
  const db = loadDB();
  db.draftsAndIdeas = draftsAndIdeas;
  saveDB(db);
};

export const updateAutomationSettings = (settings: AutomationSettings): void => {
  const db = loadDB();
  db.automationSettings = settings;
  saveDB(db);
};