import logo from "@/assets/landing/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between pt-10 pb-6 px-40">
        <Link to="/" className="flex items-center gap-1 group">
          <img
            src={logo}
            alt="FormVerse Logo"
            className="size-10 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-[20px] font-bold bg-gradient-to-r from-[#ffffff] to-[#6433dd] bg-clip-text text-transparent">
            FORMVERSE
          </span>
        </Link>

        <button
          onClick={() => navigate("/")}
          className="transition-transform duration-200 hover:scale-105 cursor-pointer"
        >
          <X />
        </button>
      </div>
      <div className="flex-1 flex justify-center">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
