import { Link } from "react-router-dom";
import Button from "../common/Button";

export function CTASection() {
  return (
    <section className="py-28 relative">
      <div
        className="absolute top-0 left-0 h-full w-full"
        style={{
          backgroundImage: `
        radial-gradient(circle at 50% -300px, #8853fa 0%, #4b1fae 10%, #000000 50%)
      `,
          opacity: 0.8,
        }}
      ></div>

      <div className="relative z-10 text-center">
        <h2 className="text-[50px] font-bold mb-4">
          Ready To Bring The Power of <br /> 3D To Your Hands?
        </h2>

        <div className="mt-8">
          <Button>
            <Link to="/creators">Start for Free Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
