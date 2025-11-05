// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, isLoading, isAuthenticated, error: authError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }
    if (!formData.password) errors.password = "Password is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Validation error");
      return;
    }

    const result = await loginUser(formData);

    if (result.success) {
      toast.success("Login successful!");
      const from = location.state?.from?.pathname || "/"; // Redirect to intended page or home
      navigate(from, { replace: true });
    } else {
      toast.error("Login failed");
       if (authError && !result.error) {
         setFormErrors(prev => ({ ...prev, general: authError }));
      } else if (result.error) {
         setFormErrors(prev => ({ ...prev, general: result.error }));
      }
    }
  };

  // If user is already authenticated, redirect them from login page
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/my-courses";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);


  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Sign in to your account</CardTitle>
          <CardDescription>
            Or{' '}
            <Button variant="link" asChild className="h-auto p-0 text-brand-accent">
              <RouterLink to="/register">create a new account</RouterLink>
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "border-destructive" : ""}
              />
              {formErrors.email && <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs text-muted-foreground">
                  <RouterLink to="/forgot-password">Forgot password?</RouterLink>
                </Button> */}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={formErrors.password ? "border-destructive" : ""}
                />
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -translate-y-1/2 right-1 top-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {formErrors.password && <p className="mt-1 text-xs text-destructive">{formErrors.password}</p>}
            </div>
            {formErrors.general && <p className="text-sm text-center text-destructive">{formErrors.general}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
             {/* Placeholder for social logins if needed in future */}
             {/* <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-background text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" className="w-full">
                Sign in with Google (Example)
            </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;