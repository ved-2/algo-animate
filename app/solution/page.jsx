"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import AudioVideoPlayer from "@/components/AudioVideoPlayer";
import { toast } from "react-toastify";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useCopilotReadable } from "@copilotkit/react-core";

const videoStyles = `
  .video-container video {
    object-fit: contain;
    max-width: 100%;
    height: auto;
  }
`;

const Page = () => {
  const [data, setData] = useState(null);
  const [selectedLang, setSelectedLang] = useState("cpp");
  const [selectedApproach, setSelectedApproach] = useState("bruteForce");
  const [videoURL, setVideoURL] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);
  const [manimScript, setManimScript] = useState(null);

  const algorithm = localStorage.getItem("currentQuestion");
  const approach = selectedApproach;
  const theory = data?.[selectedApproach]?.theory;

  useCopilotReadable({
    description:"The Problem Statement of dsa",
    value:data,
  })
  // Function to generate audio for current approach
  const generateAudio = async () => {
    if (!manimScript || !algorithm || !approach) {
      toast.error("Please generate a video first");
      return;
    }

    setAudioLoading(true);
    try {
      const response = await fetch("/api/generate-timed-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manimScript,
          algorithm,
          approach,
          theory: theory || "Algorithm explanation",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      setIsAudioEnabled(true);
      toast.success("Timed audio narration generated successfully!");
    } catch (error) {
      console.error("Audio generation error:", error);
      toast.error("Failed to generate timed audio narration");
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("solutionData");
    const question = localStorage.getItem("currentQuestion");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);

      fetch("/api/render-manim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: parsed.manimScript }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Received response:", data);
          if (data.video) {
            // Convert base64 to blob
            const binaryString = atob(data.video);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "video/mp4" });

            const reader = new FileReader();
            reader.onload = () => {
              console.log("Created data URL for video");
              setVideoURL(reader.result);
            };
            reader.readAsDataURL(blob);

            // Store the script for timed audio generation
            if (data.script) {
              setManimScript(data.script);
            }
          } else {
            throw new Error("No video data received");
          }
        })
        .catch((err) => {
          console.error("Video render failed:", err);
          // You could set an error state here to show to the user
        });

      // Generate audio narration
      generateAudio();
    }

    return () => {
      // Only revoke if it's a blob URL (starts with blob:)
      if (videoURL && videoURL.startsWith("blob:")) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, []);

  // Regenerate audio when approach changes
  useEffect(() => {
    if (data && selectedApproach) {
      const question = localStorage.getItem("currentQuestion");
      generateAudio();
    }
  }, [selectedApproach, data]);

  if (!data) {
    return (
      <p className="text-center mt-20 text-gray-500">Loading solution...</p>
    );
  }

  const section = data[selectedApproach];

  const approachTabs = [
    { key: "bruteForce", label: "🛠️ Brute Force" },
    { key: "optimal1", label: "⚡ Optimal 1" },
    { key: "optimal2", label: "💎 Optimal 2" },
  ];

  const codeTabs = [
    { label: "C++", key: "cpp" },
    { label: "C", key: "c" },
    { label: "Java", key: "java" },
    { label: "Python", key: "python" },
    { label: "DryRun", key: "dryRun" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: videoStyles }} />
      <div className="bg-[#f8f6f3] min-h-screen py-10 px-6 mt-17">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex gap-2 mb-2">
              {approachTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedApproach(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedApproach === tab.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-[#fefefe] p-4 rounded-lg shadow border">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                📘 Theory
              </h1>
              <p className="text-gray-700 whitespace-pre-wrap">
                {section.theory}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white shadow rounded-lg p-4 w-full sm:w-1/2 border">
                <h4 className="font-semibold mb-1">⏰ Time Complexity</h4>
                <p className="text-sm">{section.timeComplexity}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 w-full sm:w-1/2 border">
                <h4 className="font-semibold mb-1">💾 Space Complexity</h4>
                <p className="text-sm">{section.spaceComplexity}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#fefefe] shadow rounded-lg p-4 w-1/2 border">
                <h3 className="font-semibold text-green-700 mb-2">✅ Pros</h3>
                <ul className="list-disc text-sm pl-4 text-gray-700">
                  {section.pros?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#fefefe] shadow rounded-lg p-4 w-1/2 border">
                <h3 className="font-semibold text-red-700 mb-2">❌ Cons</h3>
                <ul className="list-disc text-sm pl-4 text-gray-700">
                  {section.cons?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#fefefe] p-4 rounded-lg shadow border">
              <h4 className="font-semibold mb-2">📌 Use Cases</h4>
              <ul className="list-disc text-sm pl-4 text-gray-700">
                {section.useCases?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6 pt-10">
            <div className="bg-[#fefefe] rounded-xl shadow p-4 flex flex-col items-center justify-center min-h-[300px]">
              {/* Video Player */}
              {videoURL ? (
                <AudioVideoPlayer
                  videoSrc={videoURL}
                  audioSrc={isAudioEnabled ? audioURL : null}
                />
              ) : (
                "Rendering animation..."
              )}
            </div>

            <div className="bg-[#fefefe] shadow rounded-lg p-4 border">
              <h3 className="font-semibold text-yellow-800 mb-3">💻 Code</h3>
              <div className="flex gap-2 mb-4 justify-between">
                <div className="flex gap-2">
                  {codeTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedLang(tab.key)}
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        selectedLang === tab.key
                          ? "bg-yellow-300 text-black"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      section.code?.[selectedLang] || ""
                    )
                  }
                >
                  Copy
                </Button>
              </div>

              <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto text-gray-800 whitespace-pre-wrap">
                <code>
                  {section.code?.[selectedLang] || "// No code available."}
                </code>
              </pre>
              <CopilotPopup />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
