"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { URL } from "./constants";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generatePrompt = (question) => `
You are an expert Data Structures and Algorithms tutor and a Manim animation developer.

Your job is to explain the given question using three approaches — brute-force, optimized 1, and optimized 2 (if applicable). Then, generate a valid Manim Community Edition script that animates the algorithm AND a valid Mermaid.js flowchart string for each approach.

IMPORTANT (Manim): The manimScript must be a complete, working Manim animation that:
1. Uses proper Manim syntax (from manim import *)
2. Has a class AlgorithmDemo(Scene) with construct(self) method
3. Creates visual elements (rectangles, circles, text) to represent data structures
4. Animates algorithm steps using self.play() and self.wait()
5. Uses colors to highlight different states (BLUE, RED, GREEN, YELLOW)
6. Shows step-by-step execution with clear visual feedback
7. Uses realistic example data (arrays, numbers, etc.)
8. Is complete and runnable without errors

IMPORTANT (Mermaid): The flowchartMermaid string for each approach must be:
1. A valid Mermaid.js v10 flowchart string.
2. Start with 'graph TD' (top-down) or 'graph LR' (left-right).
3. Clearly represent the logic (loops, decisions, steps).
4. NOT be wrapped in markdown triple backticks (\`\`\`).
5. If an approach is not applicable, set flowchartMermaid to an empty string.

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
    },
    "flowchartMermaid": "graph TD\\nA[Start] --> B{Decision};\\nB --> C[End];"
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
    },
    "flowchartMermaid": "graph LR\\nStart --> Process1 --> End;"
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
    },
    "flowchartMermaid": "graph TD\\n..."
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

      const status = response.status;
      const jsonBody = await response.json().catch((e) => {
        console.error("Failed to parse /api/gemini JSON:", e);
        throw new Error("Unexpected non-JSON response from server");
      });

      if (!response.ok) {
        console.error("/api/gemini returned non-OK status:", status, jsonBody);
        const errMsg =
          jsonBody?.error ||
          jsonBody?.body ||
          jsonBody?.details ||
          jsonBody?.message ||
          `Server error ${status}`;
        throw new Error(errMsg);
      }

      if (!jsonBody?.success || !jsonBody?.result) {
        console.error("Unexpected /api/gemini response shape:", jsonBody);
        throw new Error("Invalid response from language model proxy");
      }

      const result = jsonBody.result;

      const rawText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        result?.candidates?.[0]?.content?.text?.trim() ||
        result?.outputs?.[0]?.content?.parts?.[0]?.text?.trim() ||
        result?.outputs?.[0]?.content?.text?.trim() ||
        null;

      if (!rawText) {
        console.error("Empty response from Gemini. Full result:", result);
        throw new Error(
          "Empty response from Gemini. Check console for full response."
        );
      }

      const firstIndex = rawText.indexOf("{");
      const lastIndex = rawText.lastIndexOf("}");
      if (firstIndex === -1 || lastIndex === -1) {
        console.error(
          "Invalid response - no JSON object found in text:",
          rawText
        );
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

      // ================================================================
      // START OF MANIM SCRIPT FIX
      // ================================================================
      const fallbackManimScript = `from manim import *
class AlgorithmDemo(Scene):
    def construct(self):
        arr = [1, 2, 3, 4, 5]
        rectangles = []
        texts = []
        for i, val in enumerate(arr):
            rect = Rectangle(width=1, height=1, color=BLUE)
            rect.move_to([i * 1.5 - 3, 0, 0])
            text = Text(str(val), font_size=24, color=WHITE)
            text.move_to(rect.get_center())
            rectangles.append(rect)
            texts.append(text)
            self.play(Create(rect), Write(text))
        self.wait(1)
        title = Text("Algorithm Demo", font_size=36, color=YELLOW)
        title.move_to([0, 2, 0])
        self.play(Write(title))
        self.wait(1)
        for i in range(len(rectangles) // 2):
            self.play(
                rectangles[i].animate.set_color(RED),
                rectangles[-(i+1)].animate.set_color(RED)
            )
            self.wait(0.5)
            self.play(
                rectangles[i].animate.set_color(GREEN),
                rectangles[-(i+1)].animate.set_color(GREEN)
            )
            self.wait(0.5)
        self.play(title.animate.set_color(GREEN))
        self.wait(1)`;

      let foundScript = parsedData.manimScript;
      if (
        !foundScript ||
        typeof foundScript !== "string" ||
        foundScript.trim().length === 0
      ) {
        const manimApproachKeys = ["bruteForce", "optimal1", "optimal2"];
        for (const k of manimApproachKeys) {
          const val = parsedData[k];
          if (val?.manimScript && typeof val.manimScript === "string") {
            foundScript = val.manimScript;
            console.warn(
              `manimScript found nested in '${k}', promoting to top-level.`
            );
            break;
          }
        }
      }

      if (
        !foundScript ||
        typeof foundScript !== "string" ||
        foundScript.trim().length === 0
      ) {
        console.warn(
          "No manimScript found in Gemini response. Injecting fallback script."
        );
        parsedData.manimScript = fallbackManimScript;
      } else {
        parsedData.manimScript = foundScript;
      }
      // ================================================================
      // END OF MANIM SCRIPT FIX
      // ================================================================

      // ================================================================
      // NEW ROBUST FIX FOR ALL APPROACHES AND FLOWCHARTS
      // ================================================================

      const fallbackMermaid =
        "graph TD\nA[Start] --> B[Process Logic] --> C[End]";
      const approachKeys = ["bruteForce", "optimal1", "optimal2"];

      for (const key of approachKeys) {
        // 1. Check if the approach is missing OR is not an object (e.g., null, undefined)
        if (
          !parsedData[key] ||
          typeof parsedData[key] !== "object" ||
          parsedData[key] === null
        ) {
          console.warn(
            `Approach '${key}' is missing or invalid. Creating fallback object.`
          );
          // Create a minimal object for it so the page doesn't crash
          parsedData[key] = {
            theory: "No data provided for this approach.",
            timeComplexity: "N/A",
            spaceComplexity: "N/A",
            pros: ["N/A"],
            cons: ["N/A"],
            useCases: ["N/A"],
            code: {
              cpp: "// N/A",
              java: "// N/A",
              python: "# N/A",
              c: "// N/A",
              dryRun: "N/A",
            },
            flowchartMermaid: fallbackMermaid,
          };
        }
        // 2. If the approach *does* exist, check if its flowchart is missing.
        else if (
          !parsedData[key].flowchartMermaid ||
          typeof parsedData[key].flowchartMermaid !== "string" ||
          parsedData[key].flowchartMermaid.trim() === ""
        ) {
          console.warn(
            `No flowchartMermaid found for '${key}'. Injecting fallback.`
          );
          parsedData[key].flowchartMermaid = fallbackMermaid;
        }
      }
      // ================================================================
      // END OF NEW ROBUST FIX
      // ================================================================

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
          Turn Questions Into Animations
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

          <Button onClick={handleAskQuestion} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
