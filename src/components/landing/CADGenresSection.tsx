import video from "@/assets/landing/heroSection/video.png";

export const CADGenresSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-[#000000]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-6">Smarter 3D Analysis</h2>
          <p className="text-xl text-muted-foreground">
            Instantly analyze models, get print-ready quotations, and order a
            professional print delivered to your <br /> door without leaving the
            platform
          </p>
        </div>

        <div className="relative w-full flex justify-center items-center">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundImage:
                "radial-gradient(circle, #1489d8 0%, #1489d8 20%, #000000 90%)",
              filter: "blur(80px)",
              width: "100%",
              height: "100%",
            }}
          ></div>

          <img
            src={video}
            alt="video"
            className="relative rounded-lg object-contain max-w-full z-10"
          />
        </div>
      </div>
    </section>
  );
};
