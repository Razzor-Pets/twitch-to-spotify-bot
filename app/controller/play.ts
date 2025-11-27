// Resume playback
import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyClient } from '../lib/spotify';

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.AUTH_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const spotify = await getSpotifyClient();
  try {
    await spotify.play();
    return NextResponse.json({ success: true, action: 'play' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to play' },
      { status: 400 }
    );
  }
}