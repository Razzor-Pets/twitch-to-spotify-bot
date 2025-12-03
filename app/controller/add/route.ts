// Add song to queue (same as your !sr)
import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyClient } from '../../lib/spotify';

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.AUTH_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { query, username } = await req.json();
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  const spotify = await getSpotifyClient();

  try {
    const search = await spotify.search(query, ['track'], { limit: 1 });
    const track = search.body.tracks?.items[0];
    if (!track) return NextResponse.json({ error: 'Song not found' }, { status: 404 });

    await spotify.addToQueue(track.uri);

    return NextResponse.json({
      success: true,
      song: `${track.name} - ${track.artists.map(a => a.name).join(', ')}`,
      body: track,
      requested_by: username || 'someone'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add to queue' },
      { status: 400 }
    );
  }
}