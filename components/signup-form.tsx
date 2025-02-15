"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthResponse } from "@/types/auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface SignUpFormProps {
  onSignupSuccess?: () => void;
}

export function SignUpForm({ onSignupSuccess }: SignUpFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log(
        "Attempting to connect to:",
        "http://localhost:5001/api/auth/signup"
      );
      console.log("With data:", formData);

      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      console.log("Response received:", response.status);
      const data: AuthResponse = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Save token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success message
      toast.success("Account created successfully! Please login.");

      // Call the success callback
      onSignupSuccess?.();

      // Clear the form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
      });

      // Redirect to dashboard
      // router.push(`/dashboard/${data.user.role}`);
    } catch (err: any) {
      console.error("Full error:", err);
      setError(err.message || "Failed to connect to the server");
      toast.error(err.message || "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={handleRoleChange}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required disabled={loading} />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the terms & conditions
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#318eca] hover:bg-[#318eca]/90"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Spinner className="text-white" />
            <span>Creating Account...</span>
          </div>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
