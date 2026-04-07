ALTER TABLE date_plans ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false NOT NULL;
