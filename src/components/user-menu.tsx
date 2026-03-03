"use client";

import { BadgeCheck, LogOut, Moon, Sun } from "lucide-react";

import { useLogout } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import { useTheme } from "./theme-provider";
import { Spinner } from "./ui/spinner";

export function UserMenu() {
  const navigate = useNavigate();
  const { userProfile } = useAuthStore();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();
  const { setTheme, theme } = useTheme();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // Call backend logout
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Backend logout error:", error);
    } finally {
      // Clear local state regardless of backend success
      logout();
      queryClient.clear();

      // Sign out from Firebase
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Firebase signout error:", error);
      }

      // Navigate to login
      navigate({ to: "/login" });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border-2 rounded-full flex items-center justify-center cursor-pointer">
          <Avatar className="size-7">
            <AvatarImage
              src={userProfile?.profile?.avatar_url}
              alt={userProfile?.profile?.first_name}
            />
            <AvatarFallback className="rounded-lg text-xs">
              {userProfile?.profile?.first_name?.charAt(0).toUpperCase() ?? "U"}
              {userProfile?.profile?.last_name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal px-1">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {userProfile?.profile?.first_name +
                  " " +
                  userProfile?.profile?.last_name}
              </span>
              <span className="truncate text-xs">
                {userProfile?.user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
          <BadgeCheck />
          Account
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <p className="capitalize">{theme === "light" ? "Dark" : "Light"}</p>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          {logoutMutation.isPending ? <Spinner /> : <LogOut />}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
