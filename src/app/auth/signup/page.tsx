"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to signin page after successful signup
      router.push("/auth/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4 text-center p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight lowercase">
          create an account
        </h1>
        <p className="text-sm text-muted-foreground lowercase">
          enter your information to get started
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="lowercase">email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="lowercase"
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="password" className="lowercase">password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="lowercase"
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 lowercase">{error}</p>
        )}
        <Button type="submit" className="w-full lowercase">
          sign up
        </Button>
      </form>
      <p className="text-sm text-muted-foreground lowercase">
        already have an account?{" "}
        <Link href="/auth/signin" className="underline">
          sign in
        </Link>
      </p>
    </div>
  );
} 