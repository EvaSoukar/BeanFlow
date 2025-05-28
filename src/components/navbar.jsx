"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@/context/authContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav aria-label="Main navigation" className="fixed min-w-dvw flex items-center justify-between px-6 py-4 bg-[#6F4E37] font-semibold shadow-md flex-wrap text-[#F5F3F0]">
      <Link href="/" className="flex gap-2 items-center justify-center text-xl font-bold text-[#F5F3F0]">
        <img className="max-w-4" src="/logo.svg" alt="logo" />
        BeanFlow
      </Link>
      {
        !user && (
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </div>
        )
      }

      {user && (
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>

          {user.role === "admin" && (
            <Link href="/tasks/create" className="hover:underline">
              Create Tasks
            </Link>
          )}

          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      )}
    </nav>
  );
};
