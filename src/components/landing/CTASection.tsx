import SecondaryButton from "../common/SecondaryButton";

export function CTASection() {
  return (
    <section className="py-28 relative">
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
          <SecondaryButton>Start for Free Now</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
