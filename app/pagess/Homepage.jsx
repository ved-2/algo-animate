import React from "react";
import Hero from "../sections/Hero";
import Stats from "../sections/Stats";
import Features from "../sections/Features";
import Accordian from "../sections/Accordian";
import Feedback from "../sections/Feedback";

const Homepage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center pt-12 ">
      <Hero />
      <Features />
      <Stats />
      <Accordian />
      <Feedback />
    </div>
  );
};

export default Homepage;
