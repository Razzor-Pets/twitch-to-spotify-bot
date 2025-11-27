'use server'

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const stateCookie = request.cookies.get("spotify_auth_state");

    if(!code || !state || state !== stateCookie?.value) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    try{
        
        const response = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`
            }
        });

        const { access_token, refresh_token, expires_in } = response.data;
        
        return NextResponse.json({ message: "Callback", code, state, stateCookie, access_token, refresh_token, expires_in } , { status: 200 });

    }catch(error){
        console.log(error);
        return NextResponse.json({ message: "Error", error } , { status: 500 });
    }

    
}