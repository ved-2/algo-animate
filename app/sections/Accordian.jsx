import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Accordian = () => {
  return (
    <section className="py-20 w-full">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6 text-[#2C2522]">
          Some Frequently Asked Questions
        </h2>
        <p className="text-center text-lg text-[#4B403D] mb-12 max-w-2xl mx-auto">
          Learn algorithms the way they should be — visual, fast, and intuitive.
          Here's what AlgoAnimate is all about.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {/* Item 1 */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              🎞️ What is AlgoAnimate?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              AlgoAnimate is a platform that automatically converts coding
              problems into animated video explanations, showing logic, code,
              comparisons, and alternate approaches — all using AI.
            </AccordionContent>
          </AccordionItem>

          {/* Item 2 */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              ⚙️ How does it work?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              You submit a coding problem. The AI analyzes it, writes code,
              explains it step-by-step, and generates an animated video using
              Manim and text-to-speech. You get visual learning in one click.
            </AccordionContent>
          </AccordionItem>

          {/* Item 3 */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              🤖 What makes it different?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              Most platforms give you text or code. AlgoAnimate gives you motion.
              It explains the “how” and “why” of logic with visuals, narration,
              and alternative methods — perfect for students and visual learners.
            </AccordionContent>
          </AccordionItem>

          {/* Item 4 */}
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium text-[#2C2522]">
              🧑‍🎓 Who is it for?
            </AccordionTrigger>
            <AccordionContent className="text-[#4B403D] text-base">
              Students preparing for DSA, beginners learning to code, or anyone
              who struggles to “see” how an algorithm works. If you’ve ever
              stared at a loop confused — AlgoAnimate is for you.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Accordian;
