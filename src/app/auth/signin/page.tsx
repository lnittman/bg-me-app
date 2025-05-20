"use client";

import { SignIn } from "@clerk/elements/sign-in";

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm p-4">
      <SignIn />
    </div>
  );
}
