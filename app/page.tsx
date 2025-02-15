"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/login-form";
import { SignUpForm } from "@/components/signup-form";
import { useState } from "react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const handleSignupSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background image div with overlay */}
      <div
        className="absolute inset-0 bg-red-00 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/graduation-bg.png')`,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Overlay with reduced opacity */}
      <div className="absolute inset-0 bg-[#f3f8fc]/40" />

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#171a1f]">College Connect</h1>
          <p className="text-muted-foreground mt-2">
            Your path to academic success starts here
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm onSignupSuccess={handleSignupSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
