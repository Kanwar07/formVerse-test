import { Star } from "lucide-react";
import Button from "../common/Button";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      rating: 4.1,
      text: "Formverse has made it possible for me to stay on top of my portfolio and incorporate and 3d model in the design",
      author: "Manisha Dutta",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612c7c1?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      rating: 4.1,
      text: "Formverse has made it possible for me to stay on top of my portfolio and incorporate and 3d model in the design",
      author: "Manisha Dutta",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      rating: 4.1,
      text: "Formverse has made it possible for me to stay on top of my portfolio and incorporate and 3d model in the design",
      author: "Manisha Dutta",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 4,
      rating: 4.1,
      text: "Formverse has made it possible for me to stay on top of my portfolio and incorporate and 3d model in the design",
      author: "Manisha Dutta",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 5,
      rating: 4.1,
      text: "Formverse has made it possible for me to stay on top of my portfolio and incorporate and 3d model in the design",
      author: "Manisha Dutta",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 6,
      rating: 4.1,
      text: "Formverse has made it possible for me to stay on top of my portfolio and incorporate and 3d model in the design",
      author: "Manisha Dutta",
      role: "UX Designer",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    },
  ];

  return (
    <div className="text-white flex py-20 flex flex-row gap-20">
      {/* Left Side - Header Content */}
      <div className="flex-1 flex flex-col justify-center w-2/5">
        <h1 className="text-[30px] font-bold mb-8 leading-tight headingfont">
          See What Others
          <br />
          Are Saying
        </h1>
        <p className="font-normal opacity-80 text-[16px] mb-8 leading-relaxed subheadingfont">
          We truly listen to our users and continuously improve to meet their
          needs.
        </p>
        <Button className={`w-fit`} onClick={() => {}} style={{}}>
          Start for Free Now
        </Button>
      </div>

      {/* Right Side - Testimonials */}
      <div
        className="flex gap-6 items-center justify-center overflow-hidden relative subheadingfont w-3/5"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          maskRepeat: "no-repeat",
          maskSize: "100% 100%",
          height: "600px",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        {/* Column 1 */}
        <div className="marquee-column grid grid-cols-1 gap-6 max-w-3xl">
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#091524] backdrop-blur-sm border border-[#FFFFFF1A] rounded-[8px] p-6 hover:bg-slate-800/70 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-medium">
                  {testimonial.rating}
                </span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                {testimonial.text}
              </p>

              <hr className="w-full h-[1px] bg-[#FFFFFF1A] my-5" />

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h4 className="font-medium text-white">
                    {testimonial.author}
                  </h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="marquee-column grid grid-cols-1 gap-6 max-w-3xl">
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#091524] backdrop-blur-sm border border-[#FFFFFF1A] rounded-[8px] p-6 hover:bg-slate-800/70 transition-colors duration-300 cursor-pointer"
            >
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-medium">
                  {testimonial.rating}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm">
                {testimonial.text}
              </p>

              <hr className="w-full h-[1px] bg-[#FFFFFF1A] my-5" />

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h4 className="font-medium text-white">
                    {testimonial.author}
                  </h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animations */}
        <style>{`
          .marquee-column {
            animation: scroll-up 15s linear infinite;
            will-change: transform;
            transform: translate3d(0, 0, 0);
          }

          .marquee-column:nth-child(2) {
            animation: scroll-down 15s linear infinite;
            animation-delay: -7.5s; /* offset at 50% of the duration */
            will-change: transform;
            transform: translate3d(0, 0, 0);
          }

          @keyframes scroll-up {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(0, -50%, 0);
            }
          }

          @keyframes scroll-down {
            0% {
              transform: translate3d(0, -50%, 0);
            }
            100% {
              transform: translate3d(0, 0, 0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
