import React from "react";
import { Button } from "@/components/ui/button";
import { Codesandbox } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-[#2C2522] leading-tight">
        Visualize the Logic. <br className="hidden sm:block" /> Understand the
        Why.
      </h2>

      <p className="text-lg sm:text-xl text-[#4B403D] font-medium mb-10 max-w-2xl mx-auto">
        From problem statement to animated solution — AlgoAnimate helps you see
        how algorithms work in real time.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/visualize">
        <Button className="px-6 py-3 text-lg bg-[#2C2522] text-white hover:bg-[#403733] transition">
          Visualize
        </Button>
        </Link>

        <Button className="px-6 py-3 text-lg bg-[#2C2522] text-white hover:bg-[#403733] transition">
          Demo
        </Button>
      </div>
      <div className="my-10">
        <img
          src="/banner-1.gif"
          alt="Algorithm Animation Preview"
          className="mx-auto  max-w-full sm:max-w-md"
        />
      </div>
    </div>
  );
};

export default Hero;
