-- Praxis AI Platform - Database Schema
-- Run this SQL in the Supabase SQL Editor:
-- https://wihqnotnzzkilxfmuali.supabase.co → SQL Editor
--
-- IMPORTANT: Enable Email Auth in Supabase before running this:
-- Authentication → Providers → Email → Enable
-- (Do NOT enable "Confirm email" for development)

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  matricula TEXT UNIQUE,
  nombre TEXT NOT NULL,
  programa TEXT,
  semestre INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Policies: teachers can see all students
CREATE POLICY "Teachers can view all students"
  ON public.students FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers can insert students"
  ON public.students FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 2. SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  student_id TEXT,
  student_name TEXT,
  scenario TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'interrupted')),
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view sessions"
  ON public.sessions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sessions"
  ON public.sessions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 3. MESSAGES TABLE (Transcripts)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'agent', 'system')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view messages"
  ON public.messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 4. EVALUATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  empathy_score INTEGER CHECK (empathy_score >= 1 AND empathy_score <= 10),
  clinical_reasoning_score INTEGER CHECK (clinical_reasoning_score >= 1 AND clinical_reasoning_score <= 10),
  communication_score INTEGER CHECK (communication_score >= 1 AND communication_score <= 10),
  overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 10),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view evaluations"
  ON public.evaluations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert evaluations"
  ON public.evaluations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update evaluations"
  ON public.evaluations FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 5. INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON public.messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_evaluations_session_id ON public.evaluations(session_id);
