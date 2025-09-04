-- Seed data for testing

-- Create a test workspace
INSERT INTO workspaces (id, name, initials, color) 
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Test Workspace', 'TW', 'bg-indigo-500');

-- Create schedule slots for the test workspace
INSERT INTO schedule_slots (id, workspace_id, day_of_week, time_of_day, category, color)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, '09:00:00', 'Industry News', 'text-sky-300'),
  ('10000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, '14:00:00', 'Product Updates', 'text-indigo-300'),
  ('10000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, '11:00:00', 'Evergreen Tips', 'text-emerald-300'),
  ('10000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, '16:00:00', 'Case Studies', 'text-amber-300'),
  ('10000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 5, '10:00:00', 'Company Culture', 'text-rose-300');

-- Create some draft ideas
INSERT INTO draft_ideas (id, workspace_id, type, text)
VALUES 
  ('20000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'draft', 'The future of B2B marketing is community-led. Here''s why...'),
  ('20000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'draft', 'Our latest case study with Acme Corp shows a 300% increase in lead generation.'),
  ('20000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'idea', 'A thread about the importance of brand voice.'),
  ('20000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'idea', 'A quick tip video for productivity.');

-- Create content categories
INSERT INTO content_categories (id, workspace_id, name, description, is_evergreen)
VALUES 
  ('30000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Industry News', 'Latest news and trends in our industry', false),
  ('30000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Product Updates', 'New features and updates to our products', false),
  ('30000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Evergreen Tips', 'Timeless tips and advice that are always relevant', true);

-- Create initial automation settings
INSERT INTO automation_settings (id, workspace_id, evergreen, top_performers, repost_to_story)
VALUES 
  ('40000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', true, false, false);