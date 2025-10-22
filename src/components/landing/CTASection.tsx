import SecondaryButton from "../common/SecondaryButton";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={sectionRef}
      className="py-28 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div
        className="absolute top-0 left-0 h-full w-full"
        style={{
          backgroundImage: `
        radial-gradient(circle at 50% -300px, #8853FA66 20%, #11111100 50%)
      `,
          opacity: 0.8,
        }}
      ></div>

      <div className="relative z-10 text-center">
        <h2 className="text-[30px] font-bold mb-4 headingfont">
          Ready To Bring The Power of <br /> 3D To Your Hands?
        </h2>

        <div className="mt-8">
          <Link to="/dashboard">
            <SecondaryButton onClick={() => {}} className="" style={{}}>
              Start for Free Now
            </SecondaryButton>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
