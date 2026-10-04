import { useState } from "react";
import { GalleryVerticalEnd, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../contexts/AuthContext";

export function LoginForm({
  className,
  ...props
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  

  const {loading,login} = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return password.length < 6 ? "Password must be at least 6 characters" : "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    // Validate on change
    let errorMessage = "";
    if (id === "email") {
      errorMessage = validateEmail(value);
    } else if (id === "password") {
      errorMessage = validatePassword(value);
    }

    setErrors({
      ...errors,
      [id]: errorMessage
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check before submission
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }
    
  
    
    try {

      const response = await login(formData)

      // console.log(response.data);
      
    } catch (error) {
      console.log(error);
      
    }
  };

  const isFormValid = !errors.email && !errors.password && formData.email && formData.password;

  return (
    <div className={cn("flex flex-col gap-6 p-6 rounded-lg  text-white", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500">
                <TrendingUp className="size-6" />
              </div>
              <span className="sr-only">SmartStock</span>
            </a>
            <h1 className="text-xl font-bold text-white">Welcome to SmartStock</h1>
            <div className="text-center text-sm text-blue-200">
            Stay Equipped, Stay Efficient – Smart Stock.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-blue-100">Email:</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`bg-blue-800/50 border-blue-700 text-white placeholder:text-blue-300 ${errors.email ? "border-red-400" : "focus:border-blue-400"}`}
              />
              {errors.email && <p className="text-sm text-red-300">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-blue-100">Password:</Label>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                value={formData.password}
                onChange={handleChange}
                className={`bg-blue-800/50 border-blue-700 text-white placeholder:text-blue-300 ${errors.password ? "border-red-400" : "focus:border-blue-400"}`}
              />
              {errors.password && <p className="text-sm text-red-300">{errors.password}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-blue-300 [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-blue-200 hover:[&_a]:text-blue-100">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}