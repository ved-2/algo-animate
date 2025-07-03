"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { URL } from "./constants";
import { useRouter } from "next/navigation";

const Page = () => {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  const generatePrompt = (question) => `
You are an expert Data Structures and Algorithms tutor and a Manim animation developer.

Your job is to explain the given question using three approaches — brute-force, optimized 1, and optimized 2 (if applicable). Then, generate a valid Manim Community Edition script that animates the algorithm using example input data.

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
      "dryRun":"dryrun the code in detailed way"
    }
      
  },
  "optimal1": {
    "theory": "Clear explanation of optimized approach 1",
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
      "dryRun":"dryrun the code in detailed way"
    }
  },
  "optimal2": {
    "theory": "Explanation of optimized approach 2 if applicable, else keep fields empty",
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
      "dryRun":"dryrun the code in detailed way"
    }
      
  },
  "manimScript": "from manim import *\\nclass AlgorithmDemo(Scene):\\n    def construct(self):\\n        # animation logic"
}

---

OBJECTIVE:
- Show full explanation for each approach
- Use real example input in code and animation
- Don't skip time or space complexity
- All code must be syntactically correct
- All JSON keys and nesting must match format

---

MANIM SCRIPT RULES:
- Must import: \`from manim import *\`
- Use: \`class AlgorithmDemo(Scene):\`, with \`def construct(self):\`
- Use \`self.play()\`, \`self.wait()\`
- Use array visualization with rectangles and text
- Use arrows or pointers to show indices (i, j, etc.)
- Use text labels for variables
- Properly align elements using .move_to(), .to_edge(), .arrange(), etc.
- Animate comparisons, swaps, and steps one-by-one
- No syntax errors, and renderable with: \`manim script.py AlgorithmDemo\`

---

DO NOT:
- Add any markdown (like \`\`\`)
- Add any explanation outside the JSON
- Wrap the JSON in quotes or escape it
- Leave any undefined fields

---

Now, answer this question using the format above:

${question}
`;
// const handleAskQuestion = async () => {
//   const promptText = generatePrompt(question);
//   const payLoad = {
//     contents: [
//       {
//         parts: [
//           {
//             text: promptText,
//           },
//         ],
//       },
//     ],
//   };

//   try {
//     const response = await fetch(URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payLoad),
//     });

//     const result = await response.json();
//     const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!rawText) throw new Error("Empty response from Gemini");

//     const match = rawText.match(/\{[\s\S]*\}/);
//     if (!match) throw new Error("Invalid format: Could not extract JSON");

//     const json = JSON.parse(match[0]);

//     localStorage.setItem("solutionData", JSON.stringify(json));
//     router.push("/solution");
//   } catch (error) {
//     console.error("❌ Failed to parse Gemini response:", error);
//     alert("Something went wrong. Try again with a simpler or clearer question.");
//   }
// };

  const handleAskQuestion = async () => {
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
      const rawText = result.candidates[0].content.parts[0].text;
      console.log(rawText);
      const match = rawText.match(/\{[\s\S]*\}/); 
      if (!match) throw new Error("Invalid format: Could not extract JSON");

      const json = JSON.parse(match[0]);

      localStorage.setItem("solutionData", JSON.stringify(json));
      router.push("/solution");
    } catch (error) {
      console.error("❌ Failed to parse Gemini response:", error);
      alert("Something went wrong. Try again with a simpler question.");
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
            className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
