import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { algorithm, approach, manimScript, theory } = await req.json();

    if (!algorithm) {
      return NextResponse.json(
        { error: "No algorithm provided" },
        { status: 400 }
      );
    }

    // Create audio directory
    const audioDir = path.join(process.cwd(), "public", "audio-temp");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const audioPath = path.join(audioDir, "narration.mp3");

    // Use Gemini to generate contextual narration
    const prompt = `You are an expert algorithm narrator. Create a detailed, step-by-step audio narration script for an algorithm animation.

Algorithm: ${algorithm}
Approach: ${approach}
Theory: ${theory || "Algorithm explanation"}

Manim Script (what will be animated):
${manimScript || "Animation script"}

Create a natural, educational narration that:
1. Explains what's happening in each animation step
2. Uses clear, simple language
3. Matches the timing of the animation
4. Highlights key concepts and variables
5. Explains the algorithm logic as it unfolds
6. Uses phrases like "Now we see", "Watch as", "Notice how"
7. Is engaging and educational

Write only the narration text, no explanations or formatting. Keep it under 200 words and make it flow naturally.`;

    // Call Gemini API to generate contextual narration
    const geminiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const geminiResult = await geminiResponse.json();
    const narrationText =
      geminiResult.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      `This is the ${approach} approach to ${algorithm}. Watch as we process the data step by step.`;

    // Use gTTS (Google Text-to-Speech) to generate audio
    const pythonScript = `
import gtts
from gtts import gTTS
import os

text = """${narrationText}"""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("${audioPath.replace(/\\/g, "\\\\")}")
print("Audio generated successfully")
`;

    const scriptPath = path.join(audioDir, "generate_audio.py");
    fs.writeFileSync(scriptPath, pythonScript);

    // Run Python script to generate audio
    await new Promise((resolve, reject) => {
      exec(`python "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) {
          console.log("Audio generation error:", err);
          reject(err);
        } else {
          console.log("Audio generated:", stdout);
          resolve();
        }
      });
    });

    // Read the generated audio file
    const audioBuffer = fs.readFileSync(audioPath);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=narration.mp3",
      },
    });
  } catch (error) {
    console.log("Audio generation error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}
