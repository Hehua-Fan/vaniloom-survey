-- Migration script to make contact field nullable in existing survey_responses table
-- Run this script if you already have a survey_responses table with contact as NOT NULL

-- Make contact column nullable for existing table
ALTER TABLE public.survey_responses 
ALTER COLUMN contact DROP NOT NULL;

-- Update existing empty contact fields to NULL for cleaner data
UPDATE public.survey_responses 
SET contact = NULL 
WHERE contact = '';

-- Verify the change
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'survey_responses' 
AND column_name = 'contact';