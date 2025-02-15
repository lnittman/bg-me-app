"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/room/create");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4 text-center p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight lowercase">
          welcome back
        </h1>
        <p className="text-sm text-muted-foreground lowercase">
          sign in to your account to continue
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
          sign in
        </Button>
      </form>
      <p className="text-sm text-muted-foreground lowercase">
        don't have an account?{" "}
        <Link href="/auth/signup" className="underline">
          sign up
        </Link>
      </p>
    </div>
  );
} 