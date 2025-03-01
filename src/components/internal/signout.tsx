"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import { Button, ButtonProps } from "../ui/button";

export const DropdownSignout = (props: DropdownMenuItemProps) => {
  return (
    <DropdownMenuItem
      className="text-inter cursor-pointer font-medium text-foreground/50"
      onClick={() => signOut()}
      {...props}
    />
  );
};

export const Signout = (props: ButtonProps) => {
  return (
    <Button className="cursor-pointer" onClick={() => signOut()} {...props} />
  );
};

