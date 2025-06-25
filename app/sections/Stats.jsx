import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Stats = () => {
  return (
    <section className="bg-[#f8f6f3] py-16 w-full">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
        How AlgoAnimate Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Step 1 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              1. Enter a Problem
            </CardTitle>
            <CardDescription>
              Type or paste your DSA or coding question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Whether it's sorting, recursion, or logic-based, AlgoAnimate takes
              your input and prepares it for visualization.
            </p>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              2. AI Writes the Code
            </CardTitle>
            <CardDescription>
              Our AI turns the problem into clean, optimized code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Get code in multiple languages with explanations and alternate
              approaches, complete with pros and cons.
            </p>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              3. Visualize the Logic
            </CardTitle>
            <CardDescription>Watch the algorithm come alive.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              AlgoAnimate creates a step-by-step animation of your
              solution—ideal for understanding recursion, swaps, and flow.
            </p>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="w-[300px] bg-white shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">
              4. Learn & Share
            </CardTitle>
            <CardDescription>
              Review, download, or share your animation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Rewind the logic, download the MP4, or share the link with friends
              or classmates. Great for revision or presentation!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Stats;
