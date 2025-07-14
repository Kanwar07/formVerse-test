
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Brain } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message
        });
        return;
      }
      
      toast({
        title: "Account created!",
        description: "Check your email to confirm your registration."
      });
      
      navigate('/signin');
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="relative h-16 w-16 mr-2">
            <img 
              src="/lovable-uploads/7ba397cf-e713-44e7-8854-a7fdf2ac3f49.png" 
              alt="FormVerse Logo" 
              className="h-16 w-16"
            />
          </div>
          <span className="font-space-grotesk font-bold text-lg tracking-tight">
            <span className="text-foreground">FORM</span>
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">VERSE</span>
          </span>
        </div>
        <CardTitle className="text-xl text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Join <span className="font-space-grotesk bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span> to buy, sell, and share 3D models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm mb-4">
          Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        </div>
        <div className="flex items-center mt-2 text-xs text-center text-muted-foreground">
          <Brain className="h-3 w-3 text-[#9b87f5] mr-1" />
          <span>Powered by FormIQ - The Brain of <span className="font-space-grotesk font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span></span>
        </div>
      </CardFooter>
    </Card>
  );
}
