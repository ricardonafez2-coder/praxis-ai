import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST: Record a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, agentId, agentName, studentId, studentName, status } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const studentDisplayName = studentName || (studentId?.includes('@') ? studentId.split('@')[0] : studentId);

    // Upsert so reconnects update rather than duplicate
    const { error } = await supabase.from('sessions').upsert({
      id: sessionId,
      agent_id: agentId || null,
      agent_name: agentName || null,
      student_id: studentId || null,
      student_name: studentDisplayName,
      status: status || 'active',
      started_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true, sessionId });
  } catch (error: any) {
    console.error('[sessions API] POST error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: List sessions
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ success: true, sessions: data || [] });
  } catch (error: any) {
    console.error('[sessions API] GET error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Update session (end session, change status)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, status, endedAt } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (endedAt) {
      updates.ended_at = endedAt;
      // Calculate duration from started_at
      const { data: session } = await supabase
        .from('sessions')
        .select('started_at')
        .eq('id', sessionId)
        .single();
      if (session?.started_at) {
        const start = new Date(session.started_at).getTime();
        const end = new Date(endedAt).getTime();
        updates.duration_minutes = Math.round((end - start) / 60000);
      }
    }

    const { error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[sessions API] PATCH error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
