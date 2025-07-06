import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

function cleanupManimFiles() {
  const tempDir = path.join(process.cwd(), "public", "manim-temp");
  if (fs.existsSync(tempDir)) {
    // Only clean up old video files, not the current script
    const mediaDir = path.join(tempDir, "media");
    if (fs.existsSync(mediaDir)) {
      try {
        fs.rmSync(mediaDir, { recursive: true, force: true });
        console.log("Cleaned up media directory");
      } catch (e) {
        console.log("Error cleaning media directory:", e);
      }
    }
  }
}

function findMp4File(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const found = findMp4File(fullPath);
      if (found) return found;
    } else if (file.endsWith(".mp4")) {
      return fullPath;
    }
  }
  return null;
}

export async function POST(req) {
  let scriptPath = null;
  let tempDir = null;

  try {
    console.log("API route called");
    
    const body = await req.json();
    console.log("Request body received");
    
    const { script } = body;
    if (!script) {
      console.log("No script provided");
      return NextResponse.json({ error: "No script provided" }, { status: 400 });
    }

    console.log("Received script:", script.substring(0, 200) + "...");
    
    // Set up directories
    tempDir = path.join(process.cwd(), "public", "manim-temp");
    if (!fs.existsSync(tempDir)) {
      console.log("Creating tempDir:", tempDir);
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    scriptPath = path.join(tempDir, "script.py");
    
    // Check if script is just a template or has issues
    if (script.includes("# animation logic") || script.includes("# Create a complete algorithm animation") || !script.includes("class AlgorithmDemo(Scene):")) {
      console.log("Detected template script or missing AlgorithmDemo class, using fallback");
      const fallbackScript = `from manim import *
class AlgorithmDemo(Scene):
    def construct(self):
        # Create array visualization
        arr = [1, 2, 3, 4, 5]
        rectangles = []
        texts = []
        
        # Create rectangles for array elements
        for i, val in enumerate(arr):
            rect = Rectangle(width=1, height=1, color=BLUE)
            rect.move_to([i * 1.5 - 3, 0, 0])
            text = Text(str(val), font_size=24, color=WHITE)
            text.move_to(rect.get_center())
            rectangles.append(rect)
            texts.append(text)
            self.play(Create(rect), Write(text))
        
        self.wait(1)
        
        # Show algorithm title
        title = Text("Algorithm Demo", font_size=36, color=YELLOW)
        title.move_to([0, 2, 0])
        self.play(Write(title))
        self.wait(1)
        
        # Animate some algorithm steps
        for i in range(len(rectangles) // 2):
            # Highlight elements being processed
            self.play(
                rectangles[i].animate.set_color(RED),
                rectangles[-(i+1)].animate.set_color(RED)
            )
            self.wait(0.5)
            
            # Swap colors to show processing
            self.play(
                rectangles[i].animate.set_color(GREEN),
                rectangles[-(i+1)].animate.set_color(GREEN)
            )
            self.wait(0.5)
        
        # Show completion
        self.play(title.animate.set_color(GREEN))
        self.wait(1)`;
      
      fs.writeFileSync(scriptPath, fallbackScript);
      console.log("Fallback script written to:", scriptPath);
    } else {
          // Use the actual script from Gemini, but fix common issues
    let finalScript = script;
    
    // Fix common issues in the script
    if (script.includes("ListNode")) {
      console.log("Detected ListNode in script, replacing with Rectangle");
      finalScript = script.replace(/class ListNode\(VGroup\):/g, "# ListNode class removed");
      finalScript = finalScript.replace(/LinkedListNode/g, "Rectangle");
    }
    
    // Ensure proper imports
    if (!finalScript.includes("from manim import *")) {
      finalScript = "from manim import *\n" + finalScript;
    }
    
    // Add audio narration capability
    if (!finalScript.includes("add_sound")) {
      finalScript = finalScript.replace(/from manim import \*/g, `from manim import *
import os`);
    }
      
      fs.writeFileSync(scriptPath, finalScript);
      console.log("Original script written to:", scriptPath);
      console.log("Script preview:", finalScript.substring(0, 300) + "...");
    }

    cleanupManimFiles();

    // Verify script file exists before running manim
    if (!fs.existsSync(scriptPath)) {
      console.log("Script file not found, creating it again");
      fs.writeFileSync(scriptPath, script);
    }

    const outputPath = path.join(tempDir, "output.mp4");
    const manimCmd = `manim -ql "${scriptPath}" AlgorithmDemo`;

    console.log("Running manim command:", manimCmd);
    console.log("Working directory:", tempDir);

    const env = {
      ...process.env,
      PATH: `${process.env.PATH};C:\\Users\\vedan\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1.1-full_build\\bin`,
      FFMPEG_BINARY: "C:\\Users\\vedan\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1.1-full_build\\bin\\ffmpeg.exe"
    };

    await new Promise((resolve, reject) => {
      const child = exec(manimCmd, { cwd: tempDir, env }, (err, stdout, stderr) => {
        console.log("Manim stdout:", stdout);
        console.log("Manim stderr:", stderr);
        
        if (err) {
          console.log("Manim error:", err);
        }
        
        const mediaDir = path.join(tempDir, "media", "videos");
        const mp4File = findMp4File(mediaDir);
        
        if (mp4File) {
          console.log("Found video file:", mp4File);
          return resolve();
        }
        
        reject(new Error(stderr || stdout || err?.message || "No video file generated"));
      });

      setTimeout(() => {
        child.kill();
        reject(new Error("Manim timed out after 60 seconds"));
      }, 60000);
    });

    const mediaDir = path.join(tempDir, "media", "videos");
    const mp4File = findMp4File(mediaDir);
    if (!mp4File) return NextResponse.json({ error: "No video found" }, { status: 500 });

    fs.copyFileSync(mp4File, outputPath);

    const videoBuffer = fs.readFileSync(outputPath);
    
    // Read the script file to include in response
    let scriptContent = "";
    if (fs.existsSync(scriptPath)) {
      scriptContent = fs.readFileSync(scriptPath, 'utf8');
    }
    
    // Return both video and script as JSON
    return NextResponse.json({
      video: videoBuffer.toString('base64'),
      script: scriptContent,
      videoSize: videoBuffer.length
    }, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  } finally {
    try {
      // Only clean up the script file after manim is done
      if (scriptPath && fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
        console.log("Cleaned up script file");
      }
    } catch (e) {
      console.log("Error cleaning up script file:", e);
    }
  }
}
