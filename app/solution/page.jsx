"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState(null);
  const [selectedLang, setSelectedLang] = useState("cpp");
  const [selectedApproach, setSelectedApproach] = useState("bruteForce");
  const [videoURL, setVideoURL] = useState(null); // ✅ added this

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
    {label:"DryRun",key:"dryRun"}
  ];

  useEffect(() => {
    const stored = localStorage.getItem("solutionData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);

      fetch("/api/render-manim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: parsed.manimScript }),
      })
        .then((res) => res.blob())
        .then((blob) => setVideoURL(URL.createObjectURL(blob)))
        .catch((err) => {
          console.error("Failed to fetch video:", err);
        });
    }
  }, []);

  if (!data) {
    return (
      <p className="text-center mt-20 text-gray-500">Loading solution...</p>
    );
  }

  const section = data[selectedApproach];

  return (
    <div className="bg-[#f8f6f3] min-h-screen py-10 px-6 mt-17">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Approach Tabs */}
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

          {/* Theory */}
          <div className="bg-[#fefefe] p-4 rounded-lg shadow border">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">📘 Theory</h1>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {section.theory || "No theory available."}
            </p>
          </div>

          {/* Time/Space */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white shadow rounded-lg p-4 w-full sm:w-1/2 border">
              <h4 className="font-semibold text-gray-800 mb-1">⏰ Time Complexity</h4>
              <p className="text-gray-700 text-sm">
                {section.timeComplexity || "N/A"}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 w-full sm:w-1/2 border">
              <h4 className="font-semibold text-gray-800 mb-1">💾 Space Complexity</h4>
              <p className="text-gray-700 text-sm">
                {section.spaceComplexity || "N/A"}
              </p>
            </div>
          </div>

          {/* Pros & Cons */}
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

          {/* Use Cases */}
          <div className="bg-[#fefefe] p-4 rounded-lg shadow border">
            <h4 className="font-semibold text-gray-800 mb-2">📌 Use Cases</h4>
            <ul className="list-disc text-sm pl-4 text-gray-700">
              {section.useCases?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-1/2 space-y-6 pt-10">
          {/* Video */}
          <div className="bg-[#fefefe] rounded-xl shadow p-4 flex items-center justify-center text-gray-500 italic min-h-[300px]">
            {videoURL ? (
              <video controls className="w-full rounded-lg shadow">
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              "Rendering animation..."
            )}
          </div>

          {/* Code Section */}
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
              <div>
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
            </div>

            <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto text-gray-800 whitespace-pre-wrap">
              <code>
                {section.code?.[selectedLang] ||
                  "// No code available for this language."}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
