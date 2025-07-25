"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const dummyProblems = [
  { title: "Two Sum", difficulty: "Easy" },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
  },
  { title: "Merge k Sorted Lists", difficulty: "Hard" },
];

const dummyChartData = [
  { day: "Mon", solved: 1 },
  { day: "Tue", solved: 3 },
  { day: "Wed", solved: 2 },
  { day: "Thu", solved: 4 },
  { day: "Fri", solved: 1 },
  { day: "Sat", solved: 0 },
  { day: "Sun", solved: 2 },
];

const dummyRoadmap = [
  "Day 1-2: Arrays & Strings",
  "Day 3-4: Sorting & Searching",
  "Day 5-6: Recursion & Backtracking",
  "Day 7: Review & Practice",
];

export default function InsightsPage() {
  const [aiAdvice, setAiAdvice] = useState(
    "Focus on solving Medium-level Array problems next."
  );
  const [userQuestion, setUserQuestion] = useState("");

  const handleAskAI = () => {
    if (userQuestion.trim() !== "") {
      setAiAdvice("This is a dummy AI response based on: " + userQuestion);
      setUserQuestion("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
      {/* AI Insights */}
      <Card className="col-span-1 lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">
            🤖 AI Insights & Weekly Plan
          </h2>
          <p className="text-sm mb-4">{aiAdvice}</p>
          <ul className="list-disc ml-5 mb-4">
            {dummyRoadmap.map((item, index) => (
              <li key={index} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask AI anything about DSA..."
            />
            <Button onClick={handleAskAI}>Ask AI</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick DSA Problems */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-3">
            🚀 Quick Solve Problems
          </h2>
          <ul className="space-y-2">
            {dummyProblems.map((problem, index) => (
              <li
                key={index}
                className="p-2 rounded-lg border hover:bg-gray-100"
              >
                <div className="font-semibold">{problem.title}</div>
                <div className="text-xs text-gray-500">
                  Difficulty: {problem.difficulty}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Streaks & Bar Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-3">🔥 Streaks & Progress</h2>
          <p className="text-sm mb-4">
            Current Streak: <span className="font-bold">5 days</span>
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dummyChartData}>
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="solved" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="col-span-1 lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-3">🏅 Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-white text-center">
              <h3 className="font-semibold text-lg mb-2">5 Problems Solved</h3>
              <p className="text-sm">
                Keep going! You're just getting started.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-white text-center">
              <h3 className="font-semibold text-lg mb-2">10-Day Streak</h3>
              <p className="text-sm">Amazing consistency! Stay on track.</p>
            </div>
            <div className="p-4 rounded-lg border bg-white text-center">
              <h3 className="font-semibold text-lg mb-2">First Hard Problem</h3>
              <p className="text-sm">
                Great job tackling challenging problems!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
