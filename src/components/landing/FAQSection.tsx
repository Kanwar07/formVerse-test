"use client";

import { useState } from "react";

const FAQSection = () => {
  const faqData = [
    {
      id: "item-1",
      question: "What materials can be used in 3D printing?",
      answer:
        "3D printers can use a variety of materials including PLA, ABS, PETG, resin, nylon, and even metal powders depending on the printer type.",
    },
    {
      id: "item-2",
      question: "How long does it take to print a 3D model?",
      answer:
        "The printing time depends on the model’s size, complexity, layer height, and printer speed. Small objects may take minutes, while large models can take several hours or even days.",
    },
    {
      id: "item-3",
      question: "Do I need 3D modeling skills to print?",
      answer:
        "Basic 3D modeling skills are helpful, but you can also use pre-made 3D models from online repositories and adjust them in slicer software before printing.",
    },
    {
      id: "item-4",
      question: "Is post-processing required for 3D prints?",
      answer:
        "Yes, many prints require post-processing such as removing supports, sanding, painting, or curing (for resin prints) to achieve a finished look.",
    },
  ];

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        className={`rounded-xl px-6 py-4 backdrop-blur-md subheadingfont transition-all duration-300 relative ${
          isOpen ? "" : "border-2 border-transparent bg-[#0D0D0D99]"
        }`}
        style={
          isOpen
            ? {
                background:
                  "linear-gradient(#0D0D0D99, #0D0D0D99) padding-box, linear-gradient(to right, #0A8DD1, #8853FA) border-box",
                border: "2px solid transparent",
                backgroundClip: "padding-box, border-box",
              }
            : {}
        }
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-lg md:text-xl font-medium text-white">
            {question}
          </h3>
          <span
            className={`text-white font-bold ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>

        {isOpen && (
          <p className="mt-2 text-gray-300 leading-relaxed">{answer}</p>
        )}
      </div>
    );
  };

  return (
    <section className="relative text-white pt-20 pb-40 px-4">
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-[30px] font-bold mb-6 leading-tight headingfont">
            Everything You Need To Know
            <br />
            Before Getting Started
          </h1>
          <p className="font-normal opacity-80 text-[16px] max-w-2xl mx-auto leading-relaxed subheadingfont">
            We've gathered the most common questions
            <br />
            and answered them for you in one place.
          </p>
        </div>

        <div className="relative w-full space-y-4">
          <div className="absolute inset-0 flex z-0">
            <div
              className="w-1/2 h-full absolute right-80 top-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, #1489D4 50%, transparent 70%)",
                filter: "blur(80px)",
                opacity: "30%",
              }}
            />
            <div
              className="w-1/2 h-full absolute right-32 -top-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, #8853FA 50%, transparent 70%)",
                filter: "blur(80px)",
                opacity: "30%",
              }}
            />
          </div>

          {/* FAQ Items */}
          <div className="relative z-10 space-y-4">
            {faqData.map((item) => (
              <FAQItem
                key={item.id}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
