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

        const { refresh_token } = response.data;
        
        const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Spotify Connected!</title></head>
        <body style="font-family:system-ui;background:#000;color:#1db954;padding:40px;">
          <h1>Connected Successfully!</h1>
          <p><strong>Save this refresh token in Vercel -> Settings -> Environment Variables</strong></p>
          <pre style="background:#111;padding:20px;border-radius:8px;overflow:auto;">
            <b>SPOTIFY_REFRESH_TOKEN=</b><span style="color:#1ed760;font-size:1.2em;">${refresh_token}</span>
                    </pre>
                    <p style="color:#999;">(It has been copied to your clipboard)</p>
                    <script>
                        navigator.clipboard.writeText("${refresh_token}");
                        alert("Refresh token copied!");
                    </script>
                    </body>
                </html>
                `;
        return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
        });

    }catch(error){
        console.log(error);
        return NextResponse.json({ message: "Error", error } , { status: 500 });
    }

    
}