import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST: Register a new student or update existing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, studentName, programa, semestre } = body;

    if (!studentId || !studentName) {
      return NextResponse.json(
        { success: false, error: 'studentId and studentName required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const displayName = studentName.includes('@') ? studentName.split('@')[0] : studentName;

    // First check if student exists by matricula
    const { data: existing } = await supabase
      .from('students')
      .select('id, total_sessions')
      .eq('matricula', studentId)
      .maybeSingle();

    if (existing) {
      // Update existing student
      const { data, error } = await supabase
        .from('students')
        .update({
          nombre: displayName,
          programa: programa || null,
          semestre: semestre || null,
          total_sessions: (existing.total_sessions || 0) + 1,
          last_session: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, student: data });
    }

    // Create new student — use a proper UUID for id, studentId as matricula
    const { data, error } = await supabase
      .from('students')
      .insert({
        nombre: displayName,
        matricula: studentId,
        programa: programa || null,
        semestre: semestre || null,
        total_sessions: 1,
        last_session: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, student: data });
  } catch (error: any) {
    console.error('[students API] Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: List students
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, students: data || [] });
  } catch (error: any) {
    console.error('[students API] Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
