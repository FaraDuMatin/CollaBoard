"use client";

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const GuestInfo = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <div className="flex items-center px-2">
        <Image src="/logo.png" alt="Board Logo" width={40} height={40} />
        <span
          className={cn(
            "font-semibold text-3xl ml-2 text-black",
            font.className
          )}
        >
          CollaBoard
        </span>
      </div>
      <TabSeparator />
      <span className="text-base px-2 text-neutral-600">Guest board</span>
      <TabSeparator />
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/">
          <Button variant="board" className="text-base font-normal px-2">
            Sign in
          </Button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/">
          <Button size="sm" className="ml-1">
            Sign up to save & collaborate
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Button size="sm" asChild>
          <Link href="/">Go to dashboard</Link>
        </Button>
      </SignedIn>
    </div>
  );
};
