import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

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
  try {
    const { script } = await req.json();
    if (!script) {
      console.log("No script provided");
      return NextResponse.json({ error: "No script provided" }, { status: 400 });
    }

    // Paths
    const tempDir = path.join(process.cwd(), "public", "manim-temp");
    if (!fs.existsSync(tempDir)) {
      console.log("Creating tempDir:", tempDir);
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const scriptPath = path.join(tempDir, "script.py");
    const outputPath = path.join(tempDir, "output.mp4");

    // Write script to file
    try {
      fs.writeFileSync(scriptPath, script);
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

    // Run Manim
    const manimCmd = `manim -pql "${scriptPath}" AlgorithmDemo`;
    console.log("Running Manim command:", manimCmd);
    await new Promise((resolve, reject) => {
      exec(manimCmd, { cwd: tempDir }, (err, stdout, stderr) => {
        if (err) {
          console.log("Manim error:", stderr || stdout || err);
          reject(stderr || stdout || err);
        } else {
          console.log("Manim finished successfully");
          resolve();
        }
      });
    });

    // Find the generated .mp4 file in media/videos
    const mediaDir = path.join(process.cwd(), "media", "videos");
    let mp4File;
    try {
      mp4File = findMp4File(mediaDir);
      console.log("Found mp4 file:", mp4File);
    } catch (e) {
      console.log("Error finding mp4 file:", e);
      throw e;
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
      },
    });
  } catch (error) {
    console.log("API error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
} 