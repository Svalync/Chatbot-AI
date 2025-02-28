import { Button } from "@/components/ui/button";
import ChatBots from "./components/ChatBots";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Button>
        <Link href="/api/auth/signin">Signin</Link>
      </Button>
      <Button>
        <Link href="/api/auth/signout">Signout</Link>
      </Button>
      <hr />
      <ChatBots />
    </>
  );
}
