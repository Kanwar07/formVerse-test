import { useState, useMemo } from "react";
import heroBackground from "@/assets/landing/heroSection/heroBackground.webp";
import carousel1 from "@/assets/landing/heroSection/carousel1.webp";
import carousel2 from "@/assets/landing/heroSection/carousel2.webp";
import carousel3 from "@/assets/landing/heroSection/carousel3.webp";
import carousel4 from "@/assets/landing/heroSection/carousel4.webp";
import carousel5 from "@/assets/landing/heroSection/carousel5.webp";
import carousel6 from "@/assets/landing/heroSection/carousel6.webp";
import carousel7 from "@/assets/landing/heroSection/carousel7.webp";
import Button from "../common/Button";

export function HeroSection() {
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
    {
      image: carousel6,
      title: "AUTOPILOT CAD EDITOR",
      description: "Coming soon",
    },
    {
      image: carousel7,
      title: "ON DEMAND 3D PRINT",
      description: "Coming soon",
    },
  ];

  const [centerIndex, setCenterIndex] = useState(
    Math.floor(imageCarousel.length / 2)
  );

  const maxAngle = 60;
  const maxTranslateZ = 120;
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

  return (
    <section className="relative">
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
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span
          className="mb-4 subheadingfont rounded-full bg-transparent px-4 py-1 text-sm text-white mt-8"
          style={{
            border: "2px solid",
            borderImage:
              "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa) 1",
          }}
        >
          Made with ❤️ by creators for creators.
        </span>

        <h1
          className="text-[68px] headingfont font-extrabold leading-tight bg-clip-text text-transparent mb-4"
          style={{
            backgroundImage:
              "linear-gradient(to right, #004fb6, #ffffff, #010056)",
          }}
        >
          Your AI Powered Hub <br /> For Everything 3D
        </h1>

        <p className="max-w-2xl mb-4 text-[18px] subheadingfont text-slate-300">
          Discover, customize, and even print 3D models all in one place.
        </p>

        <Button>Explore Now</Button>
        <div
          className="flex justify-center items-center mt-20"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {imageCarousel.map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt="Dashboard"
              className="w-40 h-52 object-cover rounded-xl object-center cursor-pointer"
              style={{
                transform: transforms[index],
                transition: "transform 0.3s ease-out",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              onMouseOver={() => setCenterIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
