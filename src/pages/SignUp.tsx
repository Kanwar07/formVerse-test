
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignUpForm />
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
