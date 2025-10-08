import upload1 from "@/assets/landing/uploadSection/upload1.webp";
import upload2 from "@/assets/landing/uploadSection/upload2.webp";
import Button from "../common/Button";
import { useState, useEffect } from "react";

export function UploadDesign() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="tabs" className="pt-40 pb-20 bg-[#000000]">
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

          <Button className={`w-fit`} onClick={() => {}} style={{}}>
            Start Uploading
          </Button>
        </div>

        <div className="relative flex w-3/5">
          <img
            src={upload2}
            alt="upload2"
            className="rounded-lg object-contain h-full w-3/4"
          />

          <div className="absolute -top-17 -left-10 border-2 border-[#000000] bg-[#191919] px-2 pb-2 rounded-lg">
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

          <div className="absolute right-10 top-4 bg-[#191919] p-4 flex flex-col gap-4 rounded-lg">
            <span className="text-[10px]">Estimated price range set by AI</span>
            <div className="bg-[#000000] p-8 rounded-lg w-72">
              <div
                className="h-[2px] w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
                }}
              ></div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col text-[10px]">
                <span className="text-[#676767]">Priced between</span>
                <span>20,000 - 40,000</span>
              </div>
              <div
                style={{
                  border: "2px solid",
                  borderImage:
                    "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa) 1",
                }}
                className="px-4 py-1"
              >
                Set Price
              </div>
            </div>
          </div>

          <div className="absolute bottom-28 left-36 flex items-start justify-center">
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
    </section>
  );
}
