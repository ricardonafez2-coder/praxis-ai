'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  role: 'student' | 'agent' | 'system';
  content: string;
  timestamp: string;
}

interface SessionDetail {
  id: string;
  agent_name: string;
  student_name: string;
  status: string;
  scenario: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
}

interface Evaluation {
  empathy_score: number;
  clinical_reasoning_score: number;
  communication_score: number;
  overall_score: number;
  comments: string;
}

interface AIScoring {
  empathy_score: number;
  empathy_rationale: string;
  key_questions_score: number;
  key_questions_rationale: string;
  diagnostic_reasoning_score: number;
  diagnostic_reasoning_rationale: string;
  overall_score: number;
  overall_feedback: string;
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const supabase = createClient();

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<Evaluation>({
    empathy_score: 5,
    clinical_reasoning_score: 5,
    communication_score: 5,
    overall_score: 5,
    comments: '',
  });
  const [aiScoring, setAiScoring] = useState<AIScoring | null>(null);
  const [scoringLoading, setScoringLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      setSession(sessionData);

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });
      setMessages(messagesData || []);

      // Load existing evaluation
      const { data: evalData } = await supabase
        .from('evaluations')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      if (evalData) {
        setEvaluation({
          empathy_score: evalData.empathy_score || 5,
          clinical_reasoning_score: evalData.clinical_reasoning_score || 5,
          communication_score: evalData.communication_score || 5,
          overall_score: evalData.overall_score || 5,
          comments: evalData.comments || '',
        });
        setSaved(true);
      }

      // Load AI scoring
      const { data: scoringData } = await supabase
        .from('ai_scoring')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      if (scoringData) setAiScoring(scoringData);
    } catch (err) {
      console.error('Error loading session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAIScoring = async () => {
    setScoringLoading(true);
    try {
      // Build transcription text from messages
      const transcription = messages
        .filter((m) => m.role !== 'system')
        .map((m) => `[${m.role === 'student' ? 'Estudiante' : 'Paciente'}]: ${m.content}`)
        .join('\n\n');

      const resp = await fetch('/api/scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          transcription,
          studentId: session?.student_name,
        }),
      });

      const result = await resp.json();
      if (result.success) {
        setAiScoring(result.scoring);
      }
    } catch (err) {
      console.error('Scoring error:', err);
    } finally {
      setScoringLoading(false);
    }
  };

  const handleSaveEvaluation = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('evaluations').upsert({
        session_id: sessionId,
        ...evaluation,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setSaved(true);
    } catch (err) {
      console.error('Error saving evaluation:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Sesión no encontrada</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-blue-400 hover:text-blue-300"
        >
          ← Volver al panel
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={() => router.push('/dashboard')}
        className="text-gray-500 hover:text-gray-300 text-sm mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← Volver al panel
      </button>

      {/* Session Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Sesión con {session.agent_name}
            </h2>
            <p className="text-gray-400 text-sm">
              Alumno: {session.student_name} ·{' '}
              {new Date(session.started_at).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              session.status === 'completed'
                ? 'bg-green-500/10 text-green-400'
                : session.status === 'active'
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}
          >
            {session.status === 'completed' ? 'Completada' : session.status === 'active' ? 'En curso' : 'Interrumpida'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <MiniStat label="Minutos" value={session.duration_minutes || '—'} />
          <MiniStat label="Mensajes" value={messages.length} />
          <MiniStat label="Intervenciones" value={messages.filter((m) => m.role === 'student').length} />
          <MiniStat label="AI Score" value={aiScoring ? `${aiScoring.overall_score}/100` : '—'} highlight />
        </div>
      </div>

      {/* AI Scoring Panel */}
      {aiScoring && (
        <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h3 className="text-white font-semibold">Métricas de Desempeño — IA</h3>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">Automático</span>
            </div>
            <span className="text-3xl font-bold text-purple-400">{aiScoring.overall_score}/100</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScoreCard
              label="Empatía"
              score={aiScoring.empathy_score}
              rationale={aiScoring.empathy_rationale}
              color="pink"
            />
            <ScoreCard
              label="Preguntas Clave"
              score={aiScoring.key_questions_score}
              rationale={aiScoring.key_questions_rationale}
              color="blue"
            />
            <ScoreCard
              label="Razonamiento Diagnóstico"
              score={aiScoring.diagnostic_reasoning_score}
              rationale={aiScoring.diagnostic_reasoning_rationale}
              color="amber"
            />
          </div>

          {aiScoring.overall_feedback && (
            <div className="mt-4 bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
              <p className="text-purple-300 text-sm font-medium mb-1">Feedback General</p>
              <p className="text-gray-300 text-sm">{aiScoring.overall_feedback}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcription Panel */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold">Transcripción</h3>
            {!aiScoring && messages.length > 0 && (
              <button
                onClick={handleRunAIScoring}
                disabled={scoringLoading}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-xl hover:bg-purple-500 disabled:opacity-50 transition-colors"
              >
                {scoringLoading ? 'Analizando...' : '🤖 Analizar con IA'}
              </button>
            )}
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No hay mensajes en esta sesión.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'student'
                        ? 'bg-blue-600 text-white'
                        : msg.role === 'agent'
                        ? 'bg-gray-800 text-gray-200'
                        : 'bg-gray-800/50 text-gray-500 text-xs italic'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs opacity-70 font-medium">
                        {msg.role === 'student'
                          ? session.student_name
                          : msg.role === 'agent'
                          ? session.agent_name
                          : 'Sistema'}
                      </span>
                      <span className="text-xs opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manual Evaluation Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Evaluación Docente</h3>
          </div>
          <div className="p-6 space-y-5">
            <ScoreSlider
              label="Empatía"
              value={evaluation.empathy_score}
              onChange={(v) => setEvaluation({ ...evaluation, empathy_score: v })}
            />
            <ScoreSlider
              label="Razonamiento Clínico"
              value={evaluation.clinical_reasoning_score}
              onChange={(v) => setEvaluation({ ...evaluation, clinical_reasoning_score: v })}
            />
            <ScoreSlider
              label="Comunicación"
              value={evaluation.communication_score}
              onChange={(v) => setEvaluation({ ...evaluation, communication_score: v })}
            />
            <ScoreSlider
              label="Evaluación Global"
              value={evaluation.overall_score}
              onChange={(v) => setEvaluation({ ...evaluation, overall_score: v })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Comentarios</label>
              <textarea
                value={evaluation.comments}
                onChange={(e) => setEvaluation({ ...evaluation, comments: e.target.value })}
                rows={4}
                placeholder="Observaciones sobre el desempeño del alumno..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              onClick={handleSaveEvaluation}
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all text-sm"
            >
              {saving ? 'Guardando...' : saved ? '✅ Evaluación Actualizada' : '💾 Guardar Evaluación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 text-center">
      <p className={`text-2xl font-bold ${highlight ? 'text-purple-400' : 'text-white'}`}>{value}</p>
      <p className="text-gray-500 text-xs mt-1">{label}</p>
    </div>
  );
}

function ScoreCard({ label, score, rationale, color }: { label: string; score: number; rationale: string; color: string }) {
  const colors: Record<string, string> = {
    pink: 'border-pink-500/30 bg-pink-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
  };
  const scoreColors: Record<string, string> = {
    pink: 'text-pink-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-300 text-sm font-medium">{label}</p>
        <span className={`text-2xl font-bold ${scoreColors[color]}`}>{score}</span>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed">{rationale}</p>
    </div>
  );
}

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-400">{label}</label>
        <span className="text-sm font-bold text-white">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}
