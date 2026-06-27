// Backend API - Generate Simli Session Token + ICE Servers
// POST /api/simli-token
import { NextRequest, NextResponse } from 'next/server';
import { generateSimliSessionToken, generateIceServers } from 'simli-client';

const SIMLI_API_KEY = process.env.SIMLI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { faceId } = await request.json();
    if (!faceId) {
      return NextResponse.json({ error: 'faceId required' }, { status: 400 });
    }
    if (!SIMLI_API_KEY) {
      return NextResponse.json({ error: 'Simli API key not configured' }, { status: 500 });
    }

    // Generate session token + ICE servers in parallel
    const [sessionResult, iceServers] = await Promise.all([
      generateSimliSessionToken({
        config: {
          faceId,
          handleSilence: true,
          maxSessionLength: 3600,
          maxIdleTime: 300,
        },
        apiKey: SIMLI_API_KEY,
      }),
      generateIceServers(SIMLI_API_KEY),
    ]);

    console.log('[simli-token] Token + ICE servers generated for faceId:', faceId);
    return NextResponse.json({
      sessionToken: sessionResult.session_token,
      iceServers,
    });
  } catch (error) {
    console.error('[simli-token] Error:', error);
    return NextResponse.json({ error: 'Failed to generate Simli session' }, { status: 500 });
  }
}

