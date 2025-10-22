import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import aboutImage from "@/assets/About/About.png";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      <Navbar />

      {/* Main Content Container */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-16 py-28">
          {/* Page Title */}
          <h1 className="text-[20px] font-bold text-white mb-12 text-start">
            About Us
          </h1>

          <div className="flex flex-row gap-10">
            <div className="h-full w-full">
              <img
                src={aboutImage}
                alt="About Formverse"
                className="h-[450px] w-[345px] object-cover rounded-lg shadow-2xl"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-[20px] font-extrabold">
                At Formverse We Make a Difference
              </h2>

              <p className="text-gray-300 text-[14px] font-normal leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus vehicula libero sit amet luctus maximus. Nulla
                facilisi. Nam consectetur id nibh ut sodales. Nam tristique
                euismod nibh eu blandit. Nam at faucibus augue, quis elementum
                sapien. Nulla ac congue ante. Donec sollicitudin sem id sagittis
                posuere. Aliquam nec quam lobortis, aliquet enim id, convallis
                quam. Nam commodo non justo et finibus. Quisque eget lacus at
                tortor tincidunt rhoncus at nec magna. Praesent ultrices felis
                eu ornare ultricies. Morbi ac aliquet ante.
              </p>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Suspendisse tincidunt leo est, in consequat risus efficitur ut.
                Duis eget eros fermentum, ultrices dui a, gravida nisl. Quisque
                blandit, nibh at pulvinar pellentesque, odio purus congue est,
                quis rhoncus neque sem eu lorem. Vivamus ut euismod enim.
                Vestibulum aliquam cursus varius finibus. Vivamus ac suscipit
                tortor. Duis rutrum ac tellus tincidunt ultricies. Ut suscipit
                hendrerit diam quis semper. Cras a odio enim.
              </p>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Praesent elementum, elit faucibus pellentesque ultricies, urna
                metus blandit erat, vel consectetur purus nibh et mauris. Nulla
                a nisl volutpat, sagittis sapien ut, mollis est. In hac
                habitasse platea dictumst. Cras et dolor finibus justo cursus
                pulvinar ac a ligula. Suspendisse pharetra at mauris eget
                lacinia. Curabitur sodales sapien erat, nec sagittis lorem
                vulputate eget.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
