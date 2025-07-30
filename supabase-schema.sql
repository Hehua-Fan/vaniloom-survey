-- Supabase Database Schema
-- Run this script in Supabase SQL Editor to create the required tables

-- 创建 beta_accounts 表
CREATE TABLE IF NOT EXISTS public.beta_accounts (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_assigned BOOLEAN NOT NULL DEFAULT false,
    assigned_to TEXT,
    assigned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_beta_accounts_is_assigned ON public.beta_accounts(is_assigned);
CREATE INDEX IF NOT EXISTS idx_beta_accounts_assigned_to ON public.beta_accounts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_beta_accounts_created_at ON public.beta_accounts(created_at);

-- 启用行级安全策略 (RLS)
ALTER TABLE public.beta_accounts ENABLE ROW LEVEL SECURITY;

-- 创建安全策略：允许所有操作（您可以根据需要调整）
-- 注意：在生产环境中，您应该创建更严格的安全策略
CREATE POLICY "Enable all operations for authenticated users" ON public.beta_accounts
    FOR ALL
    USING (true);

-- 或者，如果您希望更严格的安全策略，可以使用以下策略：
-- CREATE POLICY "Enable read access for all users" ON public.beta_accounts
--     FOR SELECT
--     USING (true);
-- 
-- CREATE POLICY "Enable insert access for authenticated users" ON public.beta_accounts
--     FOR INSERT
--     WITH CHECK (true);
-- 
-- CREATE POLICY "Enable update access for authenticated users" ON public.beta_accounts
--     FOR UPDATE
--     USING (true);

-- Add comments for beta_accounts
COMMENT ON TABLE public.beta_accounts IS 'Vaniloom beta account management table';
COMMENT ON COLUMN public.beta_accounts.id IS 'Account ID';
COMMENT ON COLUMN public.beta_accounts.username IS 'Username';
COMMENT ON COLUMN public.beta_accounts.password IS 'Password';
COMMENT ON COLUMN public.beta_accounts.is_assigned IS 'Whether assigned';
COMMENT ON COLUMN public.beta_accounts.assigned_to IS 'Email address assigned to';
COMMENT ON COLUMN public.beta_accounts.assigned_at IS 'Assignment time';
COMMENT ON COLUMN public.beta_accounts.created_at IS 'Creation time';
COMMENT ON COLUMN public.beta_accounts.updated_at IS 'Update time';

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact TEXT, -- Made nullable since no longer required in new form
    age TEXT NOT NULL,
    gender TEXT NOT NULL,
    orientation TEXT NOT NULL,
    ao3_content TEXT,
    favorite_cp_tags TEXT,
    identity TEXT[] NOT NULL,
    other_identity TEXT,
    accept_follow_up TEXT NOT NULL,
    assigned_account_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint
    CONSTRAINT fk_survey_assigned_account 
        FOREIGN KEY (assigned_account_id) 
        REFERENCES public.beta_accounts(id)
);

-- Create indexes for survey_responses
CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON public.survey_responses(email);
CREATE INDEX IF NOT EXISTS idx_survey_responses_assigned_account ON public.survey_responses(assigned_account_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON public.survey_responses(created_at);

-- Enable RLS for survey_responses
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create security policy for survey_responses
CREATE POLICY "Enable all operations for authenticated users" ON public.survey_responses
    FOR ALL
    USING (true);

-- Add comments for survey_responses
COMMENT ON TABLE public.survey_responses IS 'Survey response data from beta users';
COMMENT ON COLUMN public.survey_responses.id IS 'Unique response ID';
COMMENT ON COLUMN public.survey_responses.name IS 'User nickname';
COMMENT ON COLUMN public.survey_responses.email IS 'User email address';
COMMENT ON COLUMN public.survey_responses.contact IS 'Contact information (legacy field, nullable)';
COMMENT ON COLUMN public.survey_responses.age IS 'User age range';
COMMENT ON COLUMN public.survey_responses.gender IS 'Gender identity';
COMMENT ON COLUMN public.survey_responses.orientation IS 'Sexual orientation';
COMMENT ON COLUMN public.survey_responses.ao3_content IS 'AO3 reading habits';
COMMENT ON COLUMN public.survey_responses.favorite_cp_tags IS 'Favorite ships and tags';
COMMENT ON COLUMN public.survey_responses.identity IS 'User identity categories';
COMMENT ON COLUMN public.survey_responses.other_identity IS 'Other identity specification';
COMMENT ON COLUMN public.survey_responses.accept_follow_up IS 'Willing to accept follow-up interviews';
COMMENT ON COLUMN public.survey_responses.assigned_account_id IS 'Assigned beta account ID';
COMMENT ON COLUMN public.survey_responses.created_at IS 'Response creation time';
COMMENT ON COLUMN public.survey_responses.updated_at IS 'Response update time'; 