'use server'
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import querystring from "querystring"

let cashedToken = {
    token: "",
    expires: null
}

const SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-email',
  'user-read-private'
].join(' ');

const STATE_KEY = 'spotify_auth_state';

function generateRandomString(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function GET(request: NextRequest) {

    if(request.nextUrl.searchParams.get("secret") !== process.env.AUTH_SECRET) {
        return NextResponse.json({ message: "Unauthorized", secret: request.nextUrl.searchParams.get("secret")}, { status: 401 })
    }

    const state = generateRandomString(16);
    const params = querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: SCOPES,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state
    });

    const response = NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
    response.cookies.set(STATE_KEY, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 10, // 10 minutes
        path: '/',
    });

    return response;

}