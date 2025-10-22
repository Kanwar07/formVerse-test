import { useState, useMemo, useRef } from "react";
import heroBackground from "@/assets/landing/heroSection/heroBackground.webp";
import carousel1 from "@/assets/landing/heroSection/carousel1.webp";
import carousel2 from "@/assets/landing/heroSection/carousel2.webp";
import carousel3 from "@/assets/landing/heroSection/carousel3.webp";
import carousel4 from "@/assets/landing/heroSection/carousel4.webp";
import carousel5 from "@/assets/landing/heroSection/carousel5.webp";
import { Link } from "react-router-dom";
import SecondaryButton from "../common/SecondaryButton";
import { motion } from "framer-motion";
import { useModelProgressStore } from "@/store/store";

export function HeroSection() {
  const { isProcessing } = useModelProgressStore();

  const imageCarousel = [
    {
      image: carousel1,
      title: "IMAGE TO 3D CONVERSION",
      description: "Concept to fully ready model.",
    },
    {
      image: carousel2,
      title: "TEXT TO 3D CONVERSION",
      description: "Ideas to fully ready model.",
    },
    {
      image: carousel3,
      title: "3D MARKETPLACE",
      description: "All you need in one place",
    },
    {
      image: carousel4,
      title: "FORM IQ",
      description: "Most intelligent form of IQ",
    },
    {
      image: carousel5,
      title: "HIRE A CREATOR",
      description: "Coming soon",
    },
  ];

  const [centerIndex, setCenterIndex] = useState(
    Math.floor(imageCarousel.length / 2)
  );

  const maxAngle = 60;
  const maxTranslateZ = 80;
  const overlap = 10;

  const getTransform = (index: number) => {
    const offset = index - centerIndex;
    const totalImages = imageCarousel.length;

    if (offset === 0) return `rotateY(0deg) translateZ(${maxTranslateZ}px)`;

    const maxOffset = Math.max(centerIndex, totalImages - 1 - centerIndex);
    const factor = offset / maxOffset;

    const rotateY = -factor * maxAngle;
    const translateZ = maxTranslateZ - Math.abs(factor) * 30;
    const translateX = -factor * overlap;

    return `rotateY(${rotateY}deg) translateZ(${translateZ}px) translateX(${translateX}px)`;
  };

  const transforms = useMemo(() => {
    return imageCarousel.map((_, index) => getTransform(index));
  }, [centerIndex, imageCarousel]);

  console.log(isProcessing);

  return (
    <motion.section
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div>
        <img
          src={heroBackground}
          alt="heroBackground"
          className="h-full w-full object-cover rounded-b-[80px]"
        />

        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{
            backgroundImage: `
        radial-gradient(circle at 50% -300px, #002d6e, #002d6e, #000000, #000000, #000000, #000000)
      `,
            opacity: 0.8,
          }}
        ></div>
      </div>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-[26px] p-[1px] bg-gradient-to-r from-[#0A8DD1] to-[#8853FA]">
        <div className="bg-[#011124] rounded-[26px] px-6 py-2 text-white text-[16px] flex flex-row gap-6">
          <span className="font-normal">Model in progress</span>
          <span className="font-bold">00:04</span>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span
          className="mb-4 subheadingfont rounded-full bg-transparent px-4 py-1 text-sm text-white mt-8 relative"
          style={{
            borderRadius: "10px",
          }}
        >
          {/* Gradient border using pseudo-element */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "2px",
              background:
                "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
              borderRadius: "10px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            }}
          />
          <span
            style={{ position: "relative", zIndex: 1 }}
            className="opacity-40"
          >
            Made with ❤️ by creators for creators.
          </span>
        </span>

        <h1
          className="text-[51.45px] headingfont font-bold leading-tight bg-clip-text text-transparent mb-4"
          style={{
            backgroundImage:
              "linear-gradient(to right, #004fb6, #ffffff, #010056)",
          }}
        >
          Your AI Powered Hub <br /> For Everything 3D
        </h1>

        <p className="max-w-2xl mb-4 text-[16px] subheadingfont opacity-60 font-normal">
          Discover, customize, and even print 3D models all in one place.
        </p>

        <Link to="/discover">
          <SecondaryButton className={`px-8`} onClick={() => {}} style={{}}>
            Explore Now
          </SecondaryButton>
        </Link>
        <div
          className="flex justify-center items-center mt-20"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {imageCarousel.map((item, index) => (
            <div
              key={index}
              className="relative w-40 h-52 cursor-pointer"
              style={{
                transform: transforms[index],
                transition: "transform 0.3s ease-out",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              onMouseOver={() => setCenterIndex(index)}
            >
              <img
                src={item.image}
                alt="Dashboard"
                className="w-full h-full object-cover rounded-xl object-center"
              />
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
