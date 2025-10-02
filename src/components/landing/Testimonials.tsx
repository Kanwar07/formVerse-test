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
    <div className="text-white flex py-20">
      {/* Left Side - Header Content */}
      <div className="flex-1 flex flex-col justify-center pl-16 pr-8">
        <h1 className="text-6xl font-bold mb-8 leading-tight">
          See What Others
          <br />
          Are Saying
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
          We truly listen to our users and continuously improve to meet their
          needs.
        </p>
        <Button>Start for Free Now</Button>
      </div>

      {/* Right Side - Testimonials */}
      <div
        className="flex-1 flex gap-6 items-center justify-center pr-16 overflow-hidden relative"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
          maskRepeat: "no-repeat",
          maskSize: "100% 100%",
          height: "500px",
        }}
      >
        {/* Column 1 */}
        <div className="marquee-column grid grid-cols-1 gap-6 max-w-2xl">
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors duration-300"
            >
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-medium">
                  {testimonial.rating}
                </span>
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full object-cover"
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
        <div className="marquee-column grid grid-cols-1 gap-6 max-w-2xl">
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors duration-300"
            >
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-medium">
                  {testimonial.rating}
                </span>
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full object-cover"
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
        <style jsx>{`
          .marquee-column {
            animation: scroll-up 25s linear infinite;
          }

          .marquee-column:nth-child(2) {
            animation: scroll-down 25s linear infinite;
            animation-delay: -12.5s; /* offset at 50% of the duration */
          }

          @keyframes scroll-up {
            0% {
              transform: translateY(0%);
            }
            100% {
              transform: translateY(-50%);
            }
          }

          @keyframes scroll-down {
            0% {
              transform: translateY(-50%);
            }
            100% {
              transform: translateY(0%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
