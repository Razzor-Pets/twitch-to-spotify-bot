// Skip Current Song playback and go previous 
import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyClient } from '../../lib/spotify';

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.AUTH_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const spotify = await getSpotifyClient();
  try {
    await spotify.skipToPrevious();
    return NextResponse.json({ success: true, action: 'previous' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to skip' },
      { status: 400 }
    );
  }
}