"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { URL } from "./constants";
import { useRouter } from "next/navigation";

const Page = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generatePrompt = (question) => `
You are an expert Data Structures and Algorithms tutor and a Manim animation developer.

Your job is to explain the given question using three approaches — brute-force, optimized 1, and optimized 2 (if applicable). Then, generate a valid Manim Community Edition script that animates the algorithm using example input data.

IMPORTANT: The manimScript must be a complete, working Manim animation that:
1. Uses proper Manim syntax (from manim import *)
2. Has a class AlgorithmDemo(Scene) with construct(self) method
3. Creates visual elements (rectangles, circles, text) to represent data structures
4. Animates algorithm steps using self.play() and self.wait()
5. Uses colors to highlight different states (BLUE, RED, GREEN, YELLOW)
6. Shows step-by-step execution with clear visual feedback
7. Uses realistic example data (arrays, numbers, etc.)
8. Is complete and runnable without errors

---

STRICT RESPONSE FORMAT (Only this JSON! No markdown, no explanations outside JSON):

{
  "bruteForce": {
    "theory": "Clear explanation of brute-force approach",
    "timeComplexity": "O(n^2)",
    "spaceComplexity": "O(1)",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Con 1", "Con 2", "Con 3"],
    "useCases": ["Use case 1", "Use case 2"],
    "code": {
      "cpp": "C++ code here",
      "c": "C code here",
      "java": "Java code here",
      "python": "Python code here",
      "dryRun": "Dry run details"
    }
  },
  "optimal1": {
    "theory": "Explanation of optimized approach 1",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Con 1", "Con 2", "Con 3"],
    "useCases": ["Use case 1"],
    "code": {
      "cpp": "C++ code here",
      "c": "C code here",
      "java": "Java code here",
      "python": "Python code here",
      "dryRun": "Dry run details"
    }
  },
  "optimal2": {
    "theory": "Explanation of optimized approach 2 or leave empty",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Con 1", "Con 2", "Con 3"],
    "useCases": ["Use case 1"],
    "code": {
      "cpp": "C++ code here",
      "c": "C code here",
      "java": "Java code here",
      "python": "Python code here",
      "dryRun": "Dry run details"
    }
  },
  "manimScript": "from manim import *\\nclass AlgorithmDemo(Scene):\\n    def construct(self):\\n        # Create a complete algorithm animation with:\\n        # 1. Array/Data structure visualization\\n        # 2. Step-by-step algorithm execution\\n        # 3. Color-coded elements and transitions\\n        # 4. Text labels for variables and steps\\n        # 5. Smooth animations with self.play() and self.wait()\\n        # Use example: [1, 2, 3, 4, 5] for array algorithms\\n        # Example for reverse array:\\n        arr = [1, 2, 3, 4, 5]\\n        # Show original array\\n        # Animate swapping elements\\n        # Show final reversed array"
}

---

Do not add any explanation outside the JSON.

Now answer this question:

${question}
`;

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);

    const promptText = generatePrompt(question);
    const payLoad = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!rawText) throw new Error("Empty response from Gemini");

      // Attempt to extract JSON using the first { and last }
      const firstIndex = rawText.indexOf("{");
      const lastIndex = rawText.lastIndexOf("}");
      if (firstIndex === -1 || lastIndex === -1) {
        throw new Error("Invalid response: No JSON object found");
      }

      const jsonString = rawText.substring(firstIndex, lastIndex + 1);

      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("❌ JSON parsing failed:", parseError, jsonString);
        throw new Error("Failed to parse JSON. Try rephrasing the question.");
      }

      localStorage.setItem("solutionData", JSON.stringify(parsedData));
      localStorage.setItem("currentQuestion", question);
      router.push("/solution");
    } catch (error) {
      console.error("❌ Gemini Error:", error);
      alert(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f6f3] min-h-screen flex items-center justify-center py-20 px-4">
      <div className="bg-[#fefefe] shadow-md rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
          🎞️ Turn Questions Into Animations
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Enter your DSA question below and let AlgoAnimate visualize it
          step-by-step.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="e.g., Reverse a Linked List"
            type="text"
            className="max-w-md"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            onClick={handleAskQuestion}
            disabled={loading}
            className={`px-4 py-3 rounded-lg text-white transition duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

