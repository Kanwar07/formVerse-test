import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "antd";
import SecondaryButton from "../common/SecondaryButton";
import Input from "../common/Input";
import googleIcon from "@/assets/LogIn/googleIcon.svg";
import { useNavigate, Link } from "react-router-dom";

export function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCreator, setIsCreator] = useState("false");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            role: isCreator === "true" ? "creator" : "user",
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Account created!",
        description: "Check your email to confirm your registration.",
      });

      navigate("/signin");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-6">
        <span className="text-[32px] font-semibold">Welcome Back</span>
        <span className="text-[16px] font-normal text-[#8692A6]">
          We are happy to have you back
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[16px] font-medium text-[#9794AA]">
          Full Name
        </label>
        <Input placeholder="Enter your full name"></Input>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[16px] font-medium text-[#9794AA]">
          Email Address*
        </label>
        <Input placeholder="Enter your email address"></Input>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[16px] font-medium text-[#9794AA]">
          Password
        </label>
        <Input placeholder="Enter your password"></Input>
      </div>

      <div className="flex flex-row gap-4 mb-1">
        <Checkbox defaultChecked className="custom-checkbox" />
        <label className="text-[16px] font-medium text-[#CBCAD7]">
          I agree to terms & conditions
        </label>
      </div>
      <SecondaryButton className="py-4">Register Account</SecondaryButton>

      <div className="flex flex-row items-center gap-2 w-full">
        <div className="w-full h-[1px] bg-[#686677]"></div>
        <span className="text-[12px] font-norml text-[#CBCAD7]">or</span>
        <div className="w-full h-[1px] bg-[#686677]"></div>
      </div>

      <div className="flex flex-row gap-2 w-full bg-[#100F14] rounded-[6px] px-4 py-3 items-center justify-center cursor-pointer hover:bg-[#1a1920] transition-colors">
        <img src={googleIcon} alt="Google" className="w-5 h-5" />
        <span className="text-[16px] font-medium text-[#CBCAD7]">
          Register with Google
        </span>
      </div>

      <div className="text-[16px] font-normal text-[#8692A6]">
        Already have an account?{" "}
        <Link to="/signin">
          <span className="text-[#ffffff] underline cursor-pointer">
            Log in
          </span>
        </Link>
      </div>
    </div>
  );
}
