-- Supabase 数据库表结构
-- 在 Supabase SQL Editor 中运行此脚本来创建 beta_accounts 表

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

-- 添加注释
COMMENT ON TABLE public.beta_accounts IS 'Vaniloom 内测账号管理表';
COMMENT ON COLUMN public.beta_accounts.id IS '账号ID';
COMMENT ON COLUMN public.beta_accounts.username IS '用户名';
COMMENT ON COLUMN public.beta_accounts.password IS '密码';
COMMENT ON COLUMN public.beta_accounts.is_assigned IS '是否已分配';
COMMENT ON COLUMN public.beta_accounts.assigned_to IS '分配给的邮箱地址';
COMMENT ON COLUMN public.beta_accounts.assigned_at IS '分配时间';
COMMENT ON COLUMN public.beta_accounts.created_at IS '创建时间';
COMMENT ON COLUMN public.beta_accounts.updated_at IS '更新时间'; 