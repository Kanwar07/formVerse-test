import Button from "../common/Button";
import CreatorCard from "./components/CreatorCard";

export function CreatorLeaderboardSection() {
  return (
    <section className="pb-10 z-20">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-[30px] font-bold mb-4 headingfont">
            Our CAD Creators
          </h2>
          <p className="font-normal opacity-80 text-[16px] subheadingfont">
            Empower anyone to create production-ready 3D assets from a <br />
            simple text prompt or reference images in seconds
          </p>
        </div>

        <div className="relative flex flex-row justify-center gap-8 z-10">
          <div
            className="absolute inset-0 -top-60 flex justify-center items-center -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #8853FA80 0%, transparent 75%)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "800px 600px",
              filter: "blur(140px)",
            }}
          ></div>
          {[0, 1, 2].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Actual card */}
              <CreatorCard
                key={index}
                className={index === 1 ? "z-10 -translate-y-8" : "z-0"}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button>View All Creators</Button>
        </div>
      </div>
    </section>
  );
}
