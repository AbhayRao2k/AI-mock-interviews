"use client";

import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex justify-center items-center gap-2 font-semibold rounded-full cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
};

export default LogoutButton;
