import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Features = () => {
  return (
    <section className="bg-white py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#2C2522]">
        Features That Make Us Stand Out
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Feature 1 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">Multi-Language Support</CardTitle>
            <CardDescription>
              Choose your preferred programming language.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Generate code in Python, Java, C++, and more. Perfect for learners and professionals switching stacks.
            </p>
          </CardContent>
        </Card>

        {/* Feature 2 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">Step-by-Step Animations</CardTitle>
            <CardDescription>
              See the algorithm in motion, not just theory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Watch each step of the algorithm execute with animated visuals — swap highlights, recursive flow, and more.
            </p>
          </CardContent>
        </Card>

        {/* Feature 3 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">No Signup Needed</CardTitle>
            <CardDescription>
              Use instantly without creating an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Just paste your problem and get results — no email, no forms. Fast and frictionless.
            </p>
          </CardContent>
        </Card>

        {/* Feature 4 */}
        <Card className="bg-[#f8f6f3] shadow-md border border-[#ded6cf]">
          <CardHeader>
            <CardTitle className="text-lg text-[#2C2522]">Download & Share</CardTitle>
            <CardDescription>
              Save your animations or send them to peers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4B403D]">
              Download MP4s or share algorithm visualizations with classmates and team members for better collaboration.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Features