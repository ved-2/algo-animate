import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set on server");
      return NextResponse.json(
        { error: "Server misconfiguration: missing GEMINI key" },
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let resp;
    try {
      resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (fetchErr) {
      console.error("Network error calling Gemini:", fetchErr);
      return NextResponse.json(
        { error: "Network error calling Gemini", details: fetchErr.toString() },
        { status: 502 }
      );
    }

    const text = await resp.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (err) {
      console.error("Failed to parse Gemini response as JSON:", err, text);
      // Return the raw text so client can inspect it
      return NextResponse.json(
        { error: "Invalid response from Gemini", body: text },
        { status: 502 }
      );
    }

    if (!resp.ok) {
      console.error("Gemini API error:", resp.status, json || text);
      // Return structured info: status, error body
      return NextResponse.json(
        { error: "Gemini API error", status: resp.status, body: json || text },
        { status: Math.max(500, resp.status) }
      );
    }

    return NextResponse.json({ success: true, result: json }, { status: 200 });
  } catch (error) {
    console.error("/api/gemini error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}
