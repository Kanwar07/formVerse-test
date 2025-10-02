import { Send } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative bg-[#0D0D0D] rounded-t-[80px] py-12 px-40 flex flex-col justify-between gap-40">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-row items-center">
            <img
              src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png"
              alt="FormVerse Logo"
              className="h-16 w-16"
            />
            <div className="font-bold text-lg tracking-tight">
              <span className="text-white">FORM</span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                VERSE
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span>+1 891 989-11-91</span>
            <span>hello@logoipsum.com</span>
          </div>
        </div>

        <div className="flex flex-row gap-10">
          <div className="flex flex-col gap-4">
            <div className="text-[#8F8E8A]">SERVICES</div>
            <div className="flex flex-col gap-2">
              <span>Test to 3D</span>
              <span>Image to 3D</span>
              <span>3D Printing and delivery</span>
              <span>3D Licensing</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-[#8F8E8A]">ABOUT US</div>
            <div className="flex flex-col gap-2">
              <span>Experts</span>
              <span>Pricing</span>
              <span>News</span>
              <span>About</span>
              <span>Contacts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between w-full text-[#8F8E8A]">
        <div>© 2023 — Copyright</div>
        <div>Privacy</div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#272725] rounded-lg flex flex-row gap-6 px-6 py-3 items-center">
        <Send />
        <Send />
        <div className="w-[1px] h-6 bg-[#565551]" />
        <Send />
      </div>
    </footer>
  );
}
