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

  // Avoid accessing localStorage during server-side rendering
  const [algorithm, setAlgorithm] = useState(() => {
    try {
      return typeof window !== "undefined"
        ? localStorage.getItem("currentQuestion")
        : null;
    } catch (e) {
      return null;
    }
  });
  const approach = selectedApproach;
  const theory = data?.[selectedApproach]?.theory;

  // Derive current section early so hooks order stays stable
  const section = data ? data[selectedApproach] : null;

  // ================================================================
  // --- DEBUG LOGS ---
  // Add these lines
  console.log("--- DEBUG START ---");
  console.log("Current Data Object (from localStorage):", data);
  console.log("Selected Approach Key:", selectedApproach);
  console.log("Current Section Object:", section);
  if (section) {
    console.log("Flowchart String:", section.flowchartMermaid);
  } else if (data) {
    console.log("Section is null, but data exists. Check keys.");
  }
  console.log("--- DEBUG END ---");
  // ================================================================

  useCopilotReadable({
    description: "The Problem Statement of dsa",
    value: data,
  });
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
      // set algorithm state from localStorage on client
      try {
        if (question) setAlgorithm(question);
      } catch (e) {
        console.warn("Could not read currentQuestion from localStorage", e);
      }

      // Determine script to send: prefer top-level manimScript but fall back to searching inside approaches
      // Note: The fix in File 3 should make this fallback unnecessary, but it's good defensive coding.
      let scriptToSend = parsed.manimScript;
      if (!scriptToSend) {
        // Look for manimScript inside common approach keys
        const approachKeys = ["bruteForce", "optimal1", "optimal2"];
        for (const k of approachKeys) {
          const val = parsed[k];
          if (val?.manimScript && typeof val.manimScript === "string") {
            scriptToSend = val.manimScript;
            console.warn(
              `manimScript found nested inside approach '${k}', using that as fallback.`
            );
            break;
          }
        }
      }

      if (
        !scriptToSend ||
        typeof scriptToSend !== "string" ||
        scriptToSend.trim().length === 0
      ) {
        console.error(
          "No manim script found in parsed data, aborting render.",
          parsed
        );
        // Inform the user gracefully
        try {
          toast.error(
            "No manim script found in model output. Please revise the prompt or try again."
          );
        } catch (e) {
          // toast might not be available in this file; fallback to alert
          alert(
            "No manim script found in model output. Please revise the prompt or try again."
          );
        }
      } else {
        fetch("/api/render-manim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ script: scriptToSend }),
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
      }
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

  // Helper to safely render lists that might be arrays, strings or other types
  const renderListItems = (items) => {
    if (Array.isArray(items)) {
      return items.map((item, idx) => <li key={idx}>{item}</li>);
    }
    if (items) {
      // If it's a single string or other non-array value, render it as one list item
      return <li>{String(items)}</li>;
    }
    return null;
  };
  // Render Mermaid diagram when flowchart is available
  // Mermaid rendering effect (always declared to preserve hooks order)
  useEffect(() => {
    async function renderMermaid() {
      if (!section?.flowchartMermaid) return;
      try {
        // Dynamically load mermaid from CDN
        if (!window.mermaid) {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
          script.async = true;
          document.head.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
          window.mermaid.initialize({ startOnLoad: false });
        }

        const el = document.getElementById("mermaid-diagram");
        if (!el) return;
        el.innerHTML = "";
        const insert = document.createElement("div");
        insert.className = "mermaid";
        insert.innerText = section.flowchartMermaid;
        el.appendChild(insert);
        // Render
        window.mermaid.init(undefined, insert);
      } catch (err) {
        console.error("Mermaid render error:", err);
        try {
          const el = document.getElementById("mermaid-diagram");
          if (el) {
            // Escape HTML
            const escapeHtml = (s) =>
              String(s)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\"/g, "&quot;")
                .replace(/'/g, "&#39;");

            el.innerHTML = `\n                      <div class=\"text-red-600 mb-2\">Flowchart render error: ${escapeHtml(
              err?.message || "Unknown error"
            )}</div>\n                      <pre class=\"bg-gray-100 p-2 rounded text-sm overflow-auto\">${escapeHtml(
              section.flowchartMermaid
            )}</pre>`;
          }
        } catch (fallbackErr) {
          console.error("Mermaid fallback render failed:", fallbackErr);
        }
      }
    }

    renderMermaid();
  }, [section]);

  if (!data) {
    return (
      <p className="text-center mt-20 text-gray-500">Loading solution...</p>
    );
  }

  const approachTabs = [
    { key: "bruteForce", label: "Brute Force" },
    { key: "optimal1", label: "Optimal 1" },
    { key: "optimal2", label: "Optimal 2" },
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
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Theory</h1>
              <p className="text-gray-700 whitespace-pre-wrap">
                {section.theory}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white shadow rounded-lg p-4 w-full sm:w-1/2 border">
                <h4 className="font-semibold mb-1">Time Complexity</h4>
                <p className="text-sm">{section.timeComplexity}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 w-full sm:w-1/2 border">
                <h4 className="font-semibold mb-1">Space Complexity</h4>
                <p className="text-sm">{section.spaceComplexity}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#fefefe] shadow rounded-lg p-4 w-1/2 border">
                <h3 className="font-semibold text-green-700 mb-2">Pros</h3>
                <ul className="list-disc text-sm pl-4 text-gray-700">
                  {renderListItems(section.pros)}
                </ul>
              </div>
              <div className="bg-[#fefefe] shadow rounded-lg p-4 w-1/2 border">
                <h3 className="font-semibold text-red-700 mb-2">Cons</h3>
                <ul className="list-disc text-sm pl-4 text-gray-700">
                  {renderListItems(section.cons)}
                </ul>
              </div>
            </div>

            <div className="bg-[#fefefe] p-4 rounded-lg shadow border">
              <h4 className="font-semibold mb-2">Use Cases</h4>
              <ul className="list-disc text-sm pl-4 text-gray-700">
                {renderListItems(section.useCases)}
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
              <h3 className="font-semibold text-yellow-800 mb-3">Code</h3>
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

            {/* <div className="bg-[#fefefe] shadow rounded-lg p-4 border">
              <h3 className="font-semibold text-indigo-800 mb-3">Flowchart</h3>
              <div
                id="mermaid-diagram"
                className="w-full min-h-[200px] flex items-center justify-center text-sm text-gray-500"
              >
                {section?.flowchartMermaid
                  ? "Rendering flowchart..."
                  : "No flowchart available for this approach."}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
