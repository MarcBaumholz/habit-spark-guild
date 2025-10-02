-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS habit_type TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Add new columns to habits table
ALTER TABLE public.habits
ADD COLUMN IF NOT EXISTS domains TEXT[],
ADD COLUMN IF NOT EXISTS frequency_days INTEGER,
ADD COLUMN IF NOT EXISTS context TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT,
ADD COLUMN IF NOT EXISTS smart_goal TEXT,
ADD COLUMN IF NOT EXISTS why TEXT,
ADD COLUMN IF NOT EXISTS minimal_dose TEXT,
ADD COLUMN IF NOT EXISTS habit_loop TEXT,
ADD COLUMN IF NOT EXISTS implementation_intentions TEXT,
ADD COLUMN IF NOT EXISTS hurdles TEXT,
ADD COLUMN IF NOT EXISTS reminder_type TEXT;

-- Add check constraint for difficulty
ALTER TABLE public.habits
ADD CONSTRAINT difficulty_check CHECK (difficulty IN ('Easy', 'Medium', 'Hard') OR difficulty IS NULL);

-- Add check constraint for frequency_days
ALTER TABLE public.habits
ADD CONSTRAINT frequency_days_check CHECK (frequency_days >= 1 AND frequency_days <= 7 OR frequency_days IS NULL);