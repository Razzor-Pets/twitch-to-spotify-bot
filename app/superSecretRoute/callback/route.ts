import { NextRequest, NextResponse } from "next/server";

export default function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const stateCookie = request.cookies.get("spotify_auth_state");

    if(!code || !state || state !== stateCookie?.value) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ message: "Callback", code, state, stateCookie } , { status: 200 });
}