"use client";
import { SignIn } from "@/components/internal/signin";
import { DropdownSignout } from "@/components/internal/signout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initDataFromBackendAsync } from "@/features/slices/userCredentialSlice";
import {
  initUserFromBackendAsync,
  selectUser,
} from "@/features/slices/userSlice";
import { cn } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "../SVG/Icon";

export default function Navbar() {
  const session = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  useEffect(() => {
    dispatch(initDataFromBackendAsync());
    dispatch(initUserFromBackendAsync());
  }, []);
  console.log(user);
  return (
    <div className="flex shadow-2xs justify-between items-center px-[17px] py-[14px] font-inter text-[10px] font-medium text-foreground/65 font">
      <Link className=" flex items-center text-xl gap-2.5" href="/">
        <Logo /> Svalync Chatbot
      </Link>
      <div>
        {user.name ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn("flex rounded-full cursor-pointer")}
            >
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="mr-1 mt-1.5 rounded-[3px] bg-white border-black/10"
              align="end"
            >
              <DropdownSignout>Logout</DropdownSignout>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SignIn>Log in</SignIn>
        )}
      </div>
    </div>
  );
}
