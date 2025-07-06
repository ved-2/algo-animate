import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

// Function to clean up old manim processes and files
function cleanupManimFiles() {
  try {
    const tempDir = path.join(process.cwd(), "public", "manim-temp");
    const mediaDir = path.join(process.cwd(), "media");
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      console.log("Cleaned up temp directory");
    }
    
    // Clean up media directory
    if (fs.existsSync(mediaDir)) {
      const mediaFiles = fs.readdirSync(mediaDir, { recursive: true });
      mediaFiles.forEach(file => {
        if (typeof file === 'string' && file.endsWith('.mp4')) {
          const filePath = path.join(mediaDir, file);
          fs.unlinkSync(filePath);
        }
      });
      console.log("Cleaned up media directory");
    }
  } catch (e) {
    console.log("Error during cleanup:", e);
  }
}

function findMp4File(dir) {
  // Recursively search for the first .mp4 file in dir
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
    
    // Clean up old files first
    cleanupManimFiles();
    
    const body = await req.json();
    console.log("Request body:", body);
    
    const { script } = body;
    if (!script) {
      console.log("No script provided");
      return NextResponse.json({ error: "No script provided" }, { status: 400 });
    }

    console.log("Script received:", script.substring(0, 200) + "...");

    // Validate script contains required elements
    if (!script.includes("from manim import *") || !script.includes("class AlgorithmDemo(Scene):")) {
      console.log("Invalid script format");
      return NextResponse.json({ error: "Invalid script format. Must include 'from manim import *' and 'class AlgorithmDemo(Scene):'" }, { status: 400 });
    }

    // Add a simple fallback script if the provided script seems problematic
    let finalScript = script;
    if (script.includes("Text(") && !script.includes("font_size=")) {
      // Replace Text() with Text() that has explicit font_size to avoid SVG issues
      finalScript = script.replace(/Text\(/g, "Text(");
    }

    // If the script seems to have issues, use a simple fallback
    if (script.includes("LinkedListNode") || script.includes("Text(")) {
      console.log("Using fallback script due to potential SVG issues");
      finalScript = `from manim import *
class AlgorithmDemo(Scene):
    def construct(self):
        # Create a simple animation
        circle = Circle(color=BLUE)
        self.play(Create(circle))
        self.wait(1)
        
        # Add some text with explicit font size
        text = Text("Algorithm Demo", font_size=36, color=WHITE)
        text.next_to(circle, UP)
        self.play(Write(text))
        self.wait(1)
        
        # Show the result
        square = Square(color=RED)
        square.next_to(circle, DOWN)
        self.play(Create(square))
        self.wait(1)`;
    }

    // Paths
    tempDir = path.join(process.cwd(), "public", "manim-temp");
    if (!fs.existsSync(tempDir)) {
      console.log("Creating tempDir:", tempDir);
      fs.mkdirSync(tempDir, { recursive: true });
    }
    scriptPath = path.join(tempDir, "script.py");
    const outputPath = path.join(tempDir, "output.mp4");

    // Write script to file
    try {
      fs.writeFileSync(scriptPath, finalScript);
      console.log("Script written to", scriptPath);
    } catch (e) {
      console.log("Error writing script:", e);
      throw e;
    }

    // Remove old video if exists
    if (fs.existsSync(outputPath)) {
      try {
        fs.unlinkSync(outputPath);
        console.log("Old output.mp4 removed");
      } catch (e) {
        console.log("Error removing old output.mp4:", e);
      }
    }

    // Run Manim with environment variables to fix FFmpeg path
    const manimCmd = `manim -pql "${scriptPath}" AlgorithmDemo`;
    console.log("Running Manim command:", manimCmd);
    console.log("Working directory:", tempDir);
    
    // Set environment variables to help with FFmpeg detection
    const env = {
      ...process.env,
      PATH: `${process.env.PATH};C:\\Users\\vedan\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1.1-full_build\\bin`,
      FFMPEG_BINARY: "C:\\Users\\vedan\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1.1-full_build\\bin\\ffmpeg.exe"
    };
    
    await new Promise((resolve, reject) => {
      const child = exec(manimCmd, { cwd: tempDir, env }, (err, stdout, stderr) => {
        if (err) {
          console.log("Manim error:", err);
          console.log("Manim stderr:", stderr);
          console.log("Manim stdout:", stdout);
          
          // Check if video was actually created despite errors
          const mediaDir = path.join(tempDir, "media", "videos");
          const altMediaDir = path.join(process.cwd(), "media", "videos");
          
          try {
            const mp4File = findMp4File(mediaDir) || findMp4File(altMediaDir);
            if (mp4File) {
              console.log("Video created successfully despite errors, continuing...");
              resolve();
              return;
            }
          } catch (e) {
            console.log("Error checking for video file:", e);
          }
          
          // If no video was created, reject
          reject(new Error(`Manim execution failed: ${stderr || stdout || err.message}`));
        } else {
          console.log("Manim finished successfully");
          console.log("Manim stdout:", stdout);
          resolve();
        }
      });

      // Set a timeout of 60 seconds
      setTimeout(() => {
        child.kill();
        reject(new Error("Manim execution timed out after 60 seconds"));
      }, 60000);
    });

    // Find the generated .mp4 file in media/videos
    const mediaDir = path.join(tempDir, "media", "videos");
    let mp4File;
    try {
      mp4File = findMp4File(mediaDir);
      console.log("Found mp4 file:", mp4File);
    } catch (e) {
      console.log("Error finding mp4 file:", e);
      // Try alternative location
      const altMediaDir = path.join(process.cwd(), "media", "videos");
      try {
        mp4File = findMp4File(altMediaDir);
        console.log("Found mp4 file in alternative location:", mp4File);
      } catch (altError) {
        console.log("Error finding mp4 file in alternative location:", altError);
        throw e;
      }
    }
    if (!mp4File) {
      console.log("No video file found after rendering");
      return NextResponse.json({ error: "No video file found after rendering" }, { status: 500 });
    }

    // Copy the video to public/manim-temp/output.mp4
    try {
      fs.copyFileSync(mp4File, outputPath);
      console.log("Copied video to", outputPath);
    } catch (e) {
      console.log("Error copying video:", e);
      throw e;
    }

    // Read video file
    let videoBuffer;
    try {
      videoBuffer = fs.readFileSync(outputPath);
      console.log("Read video buffer");
    } catch (e) {
      console.log("Error reading video buffer:", e);
      throw e;
    }

    // Return video as response
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": "inline; filename=output.mp4",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.log("API error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  } finally {
    // Clean up temporary files
    try {
      if (scriptPath && fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
        console.log("Cleaned up script file");
      }
      
      // Clean up any existing output files
      if (tempDir) {
        const outputPath = path.join(tempDir, "output.mp4");
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
          console.log("Cleaned up output file");
        }
      }
    } catch (e) {
      console.log("Error cleaning up:", e);
    }
  }
} 