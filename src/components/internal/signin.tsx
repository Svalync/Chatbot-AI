import { signIn } from "next-auth/react";
import { Button, ButtonProps } from "../ui/button";

export const SignIn = (props: ButtonProps) => {
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      onClick={() => signIn()}
      {...props}
    />
  );
};
