// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from 'lucide-react'; // For password visibility
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const RegisterPage = () => {

    const navigate = useNavigate();
  const { registerUser, isLoading, error: authError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    country: 'India', // Default country
    state: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleStateChange = (value) => {
    setFormData(prev => ({ ...prev, state: value }));
    if (formErrors.state) {
      setFormErrors(prev => ({ ...prev, state: null }));
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Username is required.";
    if (!formData.email.trim()) { errors.email = "Email is required."; } 
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { errors.email = "Email is invalid."; }
    if (!formData.password) { errors.password = "Password is required."; } 
    else if (formData.password.length < 6) { errors.password = "Password must be at least 6 characters long."; }
    if (!formData.state) errors.state = "State is required for heatmap functionality."; // New validation
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append('username', formData.username);
    submissionData.append('email', formData.email);
    submissionData.append('password', formData.password);
    submissionData.append('country', formData.country); // Add country
    submissionData.append('state', formData.state);     // Add state
    if (profilePicture) {
      submissionData.append('profilePicture', profilePicture);
    }

    const result = await registerUser(submissionData);

    if (result.success) {
      toast.success("Registration successful!");
      navigate('/login');
    } else {
      toast.error(result.error || "Registration failed!");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Create your account</CardTitle>
          <CardDescription>
            Or{' '}
            <Button variant="link" asChild className="h-auto p-0 text-brand-accent">
              <RouterLink to="/login">login if you already have one</RouterLink>
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={formErrors.username ? "border-destructive" : ""}
              />
              {formErrors.username && <p className="mt-1 text-xs text-destructive">{formErrors.username}</p>}
            </div>
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
               className={formErrors.username ? "border-destructive" : ""}
              />
              {formErrors.email && <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={formData.country} readOnly disabled />
                </div>
                <div>
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={handleStateChange} value={formData.state}>
                        <SelectTrigger className={formErrors.state ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                            {indianStates.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formErrors.state && <p className="mt-1 text-xs text-destructive">{formErrors.state}</p>}
                </div>
            </div>
            <div>
              <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {formErrors.general && <p className="text-sm text-center text-destructive">{formErrors.general}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="justify-center text-xs text-center text-muted-foreground">
            By creating an account, you agree to our Terms.
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;