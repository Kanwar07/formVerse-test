import upload1 from "@/assets/landing/uploadSection/upload1.webp";
import upload2 from "@/assets/landing/uploadSection/upload2.webp";
import Button from "../common/Button";

export function UploadDesign() {
  return (
    <section
      id="tabs"
      className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20"
    >
      <div className="container flex flex-row gap-4">
        <div className="flex flex-col justify-center px-16 py-20 w-2/4">
          <div className="max-w-lg">
            <h1 className="text-6xl font-black leading-none mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Upload
              <br />
              Share
              <br />
              Earn.
            </h1>

            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Turn your designs into income. Upload models, Get price
              quotations, and start earning every time your work gets downloaded
              or printed
            </p>

            <Button>Start Uploading</Button>
          </div>
        </div>

        <div className="relative flex flex-1">
          <img
            src={upload2}
            alt="upload2"
            className="rounded-lg object-contain"
            style={{
              width: "538px",
              height: "374px",
            }}
          />

          <div className="absolute -top-14 -left-10 border-2 border-[#000000] bg-[#191919] px-2 pb-2 rounded-lg">
            <img
              src={upload1}
              alt="upload1"
              className="rounded-lg object-contain size-64"
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
                <span>100%</span>
              </div>
              <div
                className="h-[2px] w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
                }}
              ></div>
            </div>
          </div>

          <div className="absolute -right-36 top-0 bg-[#191919] p-8 flex flex-col rounded-lg">
            <span>Estimated price range set by AI</span>
            <span>slider</span>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col ">
                <span>Priced between</span>
                <span>20,000 - 40,000</span>
              </div>
              <Button>Set Price</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
