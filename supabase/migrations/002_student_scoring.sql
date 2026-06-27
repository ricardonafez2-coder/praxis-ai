-- Praxis AI v2 - Migracion: Estudiantes + Transcripciones + AI Scoring
-- Ejecutar en: https://wihqnotnzzkilxfmuali.supabase.co → SQL Editor

-- ============================================
-- 1. EXTENDER STUDENTS TABLE (agregar universidad)
-- ============================================
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS universidad TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ============================================
-- 2. TRANSCRIPTIONS TABLE (texto completo de entrevistas)
-- ============================================
CREATE TABLE IF NOT EXISTS public.transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  full_text TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  student_turns INTEGER DEFAULT 0,
  agent_turns INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view transcriptions"
  ON public.transcriptions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert transcriptions"
  ON public.transcriptions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 3. AI SCORING TABLE (evaluacion automatica)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_scoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE,
  transcription_id UUID REFERENCES public.transcriptions(id) ON DELETE CASCADE,
  empathy_score NUMERIC(4,1) CHECK (empathy_score >= 0 AND empathy_score <= 100),
  empathy_rationale TEXT,
  key_questions_score NUMERIC(4,1) CHECK (key_questions_score >= 0 AND key_questions_score <= 100),
  key_questions_rationale TEXT,
  diagnostic_reasoning_score NUMERIC(4,1) CHECK (diagnostic_reasoning_score >= 0 AND diagnostic_reasoning_score <= 100),
  diagnostic_reasoning_rationale TEXT,
  overall_score NUMERIC(4,1) CHECK (overall_score >= 0 AND overall_score <= 100),
  overall_feedback TEXT,
  scored_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_scoring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ai_scoring"
  ON public.ai_scoring FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert ai_scoring"
  ON public.ai_scoring FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 4. INDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_transcriptions_session ON public.transcriptions(session_id);
CREATE INDEX IF NOT EXISTS idx_transcriptions_student ON public.transcriptions(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_scoring_session ON public.ai_scoring(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_scoring_overall ON public.ai_scoring(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_universidad ON public.students(universidad);

-- ============================================
-- 5. PROFILES TRIGGER (auto-create student profile on signup)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.students (user_id, nombre, matricula, universidad)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'nombre',
    NEW.raw_user_meta_data ->> 'matricula',
    NEW.raw_user_meta_data ->> 'universidad'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
