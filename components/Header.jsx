import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Codesandbox, LayoutDashboard, PenBox } from "lucide-react";
import Link from "next/link"; // ✅ Add this import
import React from "react";

const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-white/40 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div>
            <h1 className="text-2xl font-bold text-[#2C2522]">AlgoAnimate</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/visualize">
            
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Visualize</span>
              </Button>
            
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
