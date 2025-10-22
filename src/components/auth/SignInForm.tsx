import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "antd";
import SecondaryButton from "../common/SecondaryButton";
import Input from "../common/Input";
import googleIcon from "@/assets/LogIn/googleIcon.svg";
import { useNavigate, Link } from "react-router-dom";

const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      sessionStorage.removeItem(key);
    }
  });
};

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting to sign in with:", email);

      // Clean up existing state first
      cleanupAuthState();

      // Attempt global sign out to ensure clean state
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {
        // Continue even if this fails
        console.log("Global signout attempt:", err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in response:", { data, error });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("Sign in successful, user:", data.user.email);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });

        // Force page reload for clean state
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both email and password to sign up.",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting to sign up with:", email);

      // Clean up existing state first
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      console.log("Sign up response:", { data, error });

      if (error) {
        console.error("Sign up error:", error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("Sign up successful, user:", data.user.email);

        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          toast({
            title: "Account created!",
            description: "You have been automatically signed in.",
          });

          // Force page reload for clean state
          window.location.href = "/dashboard";
        } else {
          toast({
            title: "Account created!",
            description:
              "Please check your email to verify your account before signing in.",
          });
        }
      }
    } catch (error) {
      console.error("Unexpected sign up error:", error);
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
    <div className="flex flex-col gap-4 py-10">
      <div className="flex flex-col gap-2 mb-6">
        <span className="text-[32px] font-semibold">Welcome Back</span>
        <span className="text-[16px] font-normal text-[#8692A6]">
          We are happy to have you back
        </span>
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
      <SecondaryButton className="py-4">Login</SecondaryButton>

      <div className="flex flex-row items-center gap-2 w-full">
        <div className="w-full h-[1px] bg-[#686677]"></div>
        <span className="text-[12px] font-norml text-[#CBCAD7]">or</span>
        <div className="w-full h-[1px] bg-[#686677]"></div>
      </div>

      <div className="flex flex-row gap-2 w-full bg-[#100F14] rounded-[6px] px-4 py-3 items-center justify-center cursor-pointer hover:bg-[#1a1920] transition-colors">
        <img src={googleIcon} alt="Google" className="w-5 h-5" />
        <span className="text-[16px] font-medium text-[#CBCAD7]">
          Login with Google
        </span>
      </div>

      <div className="text-[16px] font-normal text-[#8692A6]">
        Don’t have an account?{" "}
        <Link to="/signup">
          <span className="text-[#ffffff] underline cursor-pointer">
            Register
          </span>
        </Link>
      </div>
    </div>
  );
}
