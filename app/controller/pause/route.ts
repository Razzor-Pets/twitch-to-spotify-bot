//Pause Playback 
import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyClient } from '../../lib/spotify';

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.AUTH_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const spotify = await getSpotifyClient();
  try {
    await spotify.pause();
    return NextResponse.json({ success: true, action: 'pause' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to pause' },
      { status: 400 }
    );
  }
}