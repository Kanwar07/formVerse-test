import upload1 from "@/assets/landing/uploadSection/upload1.webp";
import upload2 from "@/assets/landing/uploadSection/upload2.webp";
import Button from "../common/Button";
import { useState, useEffect, useRef } from "react";
import { Slider } from "antd";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

export function UploadDesign() {
  const [progress, setProgress] = useState(0);
  const [sliderValues, setSliderValues] = useState<[number, number]>([0, 0]);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Target values for slider animation
  const targetValues: [number, number] = [20000, 40000];

  useEffect(() => {
    // Only start animations when section is in view
    if (!isInView) return;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50); // Update every 50ms for smooth animation

    // Slider animation
    const duration = 2000; // 2 seconds
    const steps = 60; // Number of steps for smooth animation
    const stepDuration = duration / steps;
    let currentStep = 0;

    const sliderInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newValues: [number, number] = [
        Math.round(targetValues[0] * easeOut),
        Math.round(targetValues[1] * easeOut),
      ];

      setSliderValues(newValues);

      if (currentStep >= steps) {
        clearInterval(sliderInterval);
        setSliderValues(targetValues);
      }
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(sliderInterval);
    };
  }, [isInView]);

  return (
    <motion.section
      ref={sectionRef}
      id="tabs"
      className="pt-20 pb-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container flex flex-row gap-4 px-10">
        <div className="flex flex-col justify-center pl-16 py-20 w-2/5">
          <h1 className="text-[30px] mb-8 leading-tight headingfont font-bold">
            Upload
            <br />
            Share
            <br />
            Earn.
          </h1>

          <p className="text-[16px] subheadingfont font-normal text-[#ffffff] opacity-80 mb-8 leading-relaxed w-1/2">
            Turn your designs into income. Upload models, Get price quotations,
            and start earning every time your work gets downloaded or printed
          </p>

          <Link to="/upload">
            <Button className={`w-fit`} onClick={() => {}} style={{}}>
              Start Uploading
            </Button>
          </Link>
        </div>

        <div className="relative flex w-3/5">
          <div
            className="absolute top-0 left-0 h-full w-full z-0"
            style={{
              backgroundImage: `radial-gradient(circle, #051F47,  #000000)`,
              filter: "blur(80px)",
            }}
          ></div>

          <img
            src={upload2}
            alt="upload2"
            className="rounded-lg object-contain h-full w-3/4 relative z-10"
          />

          <div className="absolute -top-17 -left-10 border-2 border-[#000000] bg-[#191919] px-2 pb-2 rounded-lg z-20">
            <img
              src={upload1}
              alt="upload1"
              className="rounded-lg object-contain size-56"
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
                  }}
                >
                  Uploading
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-75 ease-out rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundImage:
                      "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="absolute right-10 top-4 bg-[#191919] p-4 flex flex-col gap-4 rounded-lg z-20">
            <span className="text-[10px]">Estimated price range set by AI</span>
            <div className="bg-[#000000] px-8 py-4 rounded-lg w-72">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400">
                  Current Range:
                </span>
                <span className="text-[12px] font-semibold">
                  ${sliderValues[0].toLocaleString()} - $
                  {sliderValues[1].toLocaleString()}
                </span>
              </div>
              <Slider
                range={{ draggableTrack: true }}
                value={sliderValues}
                onChange={(value) => setSliderValues(value as [number, number])}
                min={0}
                max={100000}
                className="w-full"
                styles={{
                  rail: {
                    backgroundColor: "white",
                  },
                  track: {
                    backgroundImage:
                      "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
                    backgroundColor: "transparent",
                  },
                  tracks: {
                    backgroundImage:
                      "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
                    backgroundColor: "transparent",
                  },
                }}
              />
              <div className="flex justify-between items-center mt-2 text-[14px] font-extrabold">
                <span>0</span>
                <span>100,000</span>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col text-[10px]">
                <span className="text-[#676767]">Priced between</span>
                <span>
                  {sliderValues[0].toLocaleString()} -{" "}
                  {sliderValues[1].toLocaleString()}
                </span>
              </div>
              <Button>Set Price</Button>
            </div>
          </div>

          <div className="absolute bottom-16 left-48 flex items-start justify-center z-20">
            <div className="bg-[#212121] rounded-full px-4 py-4 flex items-center gap-2 relative">
              {/* Stripe Icon */}
              <div className="bg-indigo-600 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-3xl font-bold">S</span>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-semibold text-[12px]">
                    Stripe
                  </h3>
                </div>
                <p className="text-white text-[10px]">
                  You received a payment of{" "}
                  <span className="font-semibold">$100.00</span> from
                  <br />
                  <span className="font-medium">zuck@gmai.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
