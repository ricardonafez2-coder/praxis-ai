// Simli WebRTC Service
// Manages the connection to Simli for facial animation

const SIMLI_API_KEY = process.env.SIMLI_API_KEY || '7djtfrat4viyt0hbkh59w';
const SIMLI_BASE = 'https://api.simli.com/v1';

export interface SimliConnectionConfig {
  faceId: string;
  apiKey?: string;
}

export interface SimliStreamResponse {
  streamUrl: string;
  sessionId: string;
}

/**
 * Initialize a Simli streaming session for a given face
 */
export async function startSimliStream(config: SimliConnectionConfig): Promise<SimliStreamResponse> {
  const apiKey = config.apiKey || SIMLI_API_KEY;

  const response = await fetch(`${SIMLI_BASE}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      faceId: config.faceId,
      // WebRTC config for low-latency streaming
      streaming: true,
      sync: 'realtime',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Simli API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return {
    streamUrl: data.streamUrl || data.stream_url,
    sessionId: data.sessionId || data.session_id,
  };
}

/**
 * Stop an active Simli streaming session
 */
export async function stopSimliStream(sessionId: string): Promise<void> {
  const response = await fetch(`${SIMLI_BASE}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SIMLI_API_KEY}`,
    },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    console.error(`Failed to stop Simli session ${sessionId}: ${response.status}`);
  }
}
