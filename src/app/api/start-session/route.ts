// Backend API - Session Initialization
import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const SIMLI_API_KEY = process.env.SIMLI_API_KEY || '';
const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1/convai';

export async function POST(request: NextRequest) {
  try {
    const { agentId, studentId } = await request.json();
    if (!agentId || !studentId) {
      return NextResponse.json({ error: 'agentId and studentId required' }, { status: 400 });
    }
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const res = await fetch(
      ELEVENLABS_BASE + '/conversation/get-signed-url?agent_id=' + encodeURIComponent(agentId),
      { headers: { 'xi-api-key': ELEVENLABS_API_KEY } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'ElevenLabs error: ' + res.status }, { status: res.status });
    }

    const { signed_url: signedUrl } = await res.json();
    if (!signedUrl) {
      return NextResponse.json({ error: 'No signed URL' }, { status: 500 });
    }

    // Generate a proper UUID for the session
    const sessionId = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      sessionId,
      elevenLabsSignedUrl: signedUrl,
      simliApiKey: SIMLI_API_KEY || null,
      agentId,
      studentId,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });
  } catch (error) {
    console.error('[start-session] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
