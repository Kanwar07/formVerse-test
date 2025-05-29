
import { SignInForm } from "@/components/auth/SignInForm";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignInForm />
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
