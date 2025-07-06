import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { manimScript, algorithm, approach, theory } = await req.json();
    
    if (!manimScript) {
      return NextResponse.json({ error: "No manim script provided" }, { status: 400 });
    }

    // Create audio directory
    const audioDir = path.join(process.cwd(), "public", "audio-temp");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Analyze the manim script to extract timing and actions
    const scriptAnalysis = analyzeManimScript(manimScript);
    
    // Generate timed narration using Gemini
    const timedNarration = await generateTimedNarration(scriptAnalysis, algorithm, approach, theory);
    
    // Create audio segments and combine them
    const audioPath = await createTimedAudio(timedNarration, audioDir);
    
    // Read the generated audio file
    const audioBuffer = fs.readFileSync(audioPath);
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=timed-narration.mp3",
      },
    });

  } catch (error) {
    console.log("Timed audio generation error:", error);
    console.log("Error details:", error.stack);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

function analyzeManimScript(script) {
  const analysis = {
    totalDuration: 0,
    segments: [],
    actions: []
  };

  // Extract timing information from manim script
  const lines = script.split('\n');
  let currentTime = 0;
  let segmentIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for self.wait() calls to track timing
    if (line.includes('self.wait(')) {
      const waitMatch = line.match(/self\.wait\((\d+(?:\.\d+)?)\)/);
      if (waitMatch) {
        const waitTime = parseFloat(waitMatch[1]);
        currentTime += waitTime;
        analysis.totalDuration += waitTime;
      }
    }
    
    // Look for self.play() calls to identify actions
    if (line.includes('self.play(')) {
      const action = extractActionFromPlay(line);
      if (action) {
        analysis.actions.push({
          time: currentTime,
          action: action,
          segmentIndex: segmentIndex
        });
        segmentIndex++;
      }
    }
    
    // Look for Create, Write, Transform animations
    if (line.includes('Create(') || line.includes('Write(') || line.includes('Transform(')) {
      const animation = extractAnimationType(line);
      if (animation) {
        analysis.segments.push({
          startTime: currentTime,
          duration: 1.0, // Default duration
          type: animation.type,
          description: animation.description,
          segmentIndex: segmentIndex
        });
        segmentIndex++;
      }
    }
  }

  return analysis;
}

function extractActionFromPlay(line) {
  // Extract what's being animated from self.play() calls
  if (line.includes('Create(')) {
    return 'creating element';
  } else if (line.includes('Write(')) {
    return 'writing text';
  } else if (line.includes('Transform(')) {
    return 'transforming element';
  } else if (line.includes('set_color(')) {
    return 'changing color';
  } else if (line.includes('animate.')) {
    return 'animating element';
  }
  return 'performing action';
}

function extractAnimationType(line) {
  if (line.includes('Create(')) {
    return { type: 'create', description: 'creating new element' };
  } else if (line.includes('Write(')) {
    return { type: 'write', description: 'writing text' };
  } else if (line.includes('Transform(')) {
    return { type: 'transform', description: 'transforming element' };
  } else if (line.includes('set_color(')) {
    return { type: 'color', description: 'changing color' };
  }
  return null;
}

async function generateTimedNarration(scriptAnalysis, algorithm, approach, theory) {
  const prompt = `You are an expert algorithm narrator. Create timed audio narration segments that match the animation timing.

Algorithm: ${algorithm}
Approach: ${approach}
Theory: ${theory || "Algorithm explanation"}

Animation Analysis:
- Total Duration: ${scriptAnalysis.totalDuration} seconds
- Number of Segments: ${scriptAnalysis.segments.length}
- Actions: ${scriptAnalysis.actions.map(a => `${a.time}s: ${a.action}`).join(', ')}

Create ${scriptAnalysis.segments.length} narration segments that:
1. Match the timing of each animation segment
2. Explain what's happening at that exact moment
3. Use natural, educational language
4. Are 1-3 seconds long each
5. Flow together seamlessly

Format each segment as: "time: narration_text"

Example:
"0: Welcome to the ${algorithm} algorithm. Let's start by examining our data."
"1: Now we create the first element and position it on screen."
"2: Watch as we compare these two elements and decide whether to swap them."

Write only the timed narration, no explanations.`;

  // Call Gemini API
  const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD0aL6eVBo0qQqmrMuJUtjnkCJx3ktij6g", {
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
  return geminiResult.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
    `0: Welcome to the ${algorithm} algorithm. Let's examine our data step by step.`;
}

async function createTimedAudio(timedNarration, audioDir) {
  // Parse the timed narration
  const segments = parseTimedNarration(timedNarration);
  
  // Generate audio for each segment
  const audioFiles = [];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const audioFile = path.join(audioDir, `segment_${i}.mp3`);
    
    // Generate audio for this segment
    const escapedNarration = segment.narration.replace(/"/g, '\\"').replace(/'/g, "\\'");
    const pythonScript = `
import gtts
from gtts import gTTS
import os

text = "${escapedNarration}"

tts = gTTS(text=text, lang='en', slow=False)
tts.save("${audioFile.replace(/\\/g, '\\\\')}")
print("Segment ${i} generated")
`;

    const scriptPath = path.join(audioDir, `generate_segment_${i}.py`);
    fs.writeFileSync(scriptPath, pythonScript);

    await new Promise((resolve, reject) => {
      exec(`python "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) {
          console.log(`Segment ${i} generation error:`, err);
          console.log(`Segment ${i} stderr:`, stderr);
          console.log(`Segment ${i} stdout:`, stdout);
          reject(err);
        } else {
          console.log(`Segment ${i} generated:`, stdout);
          audioFiles.push(audioFile);
          resolve();
        }
      });
    });
  }

  // Combine audio files with proper timing
  const finalAudioPath = path.join(audioDir, "final-narration.mp3");
  
  // Use ffmpeg to concatenate audio files
  const concatScript = `
import subprocess
import os

input_files = ${JSON.stringify(audioFiles)}
output_file = "${finalAudioPath.replace(/\\/g, '\\\\')}"

# Create file list for ffmpeg
with open("${audioDir.replace(/\\/g, '\\\\')}/filelist.txt", "w") as f:
    for file in input_files:
        f.write(f"file '{file}'\\n")

# Concatenate using ffmpeg
subprocess.run([
    "ffmpeg", "-f", "concat", "-safe", "0", 
    "-i", "${audioDir.replace(/\\/g, '\\\\')}/filelist.txt", 
    "-c", "copy", output_file
])
print("Audio concatenated successfully")
`;

  const concatScriptPath = path.join(audioDir, "concat_audio.py");
  fs.writeFileSync(concatScriptPath, concatScript);

  await new Promise((resolve, reject) => {
    exec(`python "${concatScriptPath}"`, (err, stdout, stderr) => {
      if (err) {
        console.log("Audio concatenation error:", err);
        reject(err);
      } else {
        console.log("Audio concatenated:", stdout);
        resolve();
      }
    });
  });

  return finalAudioPath;
}

function parseTimedNarration(narration) {
  const segments = [];
  const lines = narration.split('\n');
  
  for (const line of lines) {
    const match = line.match(/(\d+):\s*(.+)/);
    if (match) {
      segments.push({
        time: parseInt(match[1]),
        narration: match[2].trim()
      });
    }
  }
  
  return segments;
} 