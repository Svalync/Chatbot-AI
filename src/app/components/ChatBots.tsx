"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  initChatbotsFromBackendAsync,
  selectChatbot,
  selectChatbots,
} from "@/features/slices/chatbotSlice";
import { AppDispatch } from "@/store";
import { format } from "date-fns";
import { MoreVerticalIcon, Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid4v } from "uuid";
import PageLoader from "./PageLoader";
import Navbar from "./Navbar";

export default function ChatBots() {
  const dispatch = useDispatch<AppDispatch>();

  const chatbots = useSelector(selectChatbots);
  const chatbot = useSelector(selectChatbot);

  useEffect(() => {
    dispatch(initChatbotsFromBackendAsync());
  }, []);
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 space-y-10">
        <h2 className="font-bricolage text-2xl font-semibold text-foreground">
          Welcome to Svalync Chatbots
        </h2>

        <div className="overflow-hidden">
          <div className="border-b border-[#D7D3C9] space-y-2 py-4">
            <h2 className="font-bricolage text-xl font-semibold text-foreground">
              My Chatbots
            </h2>
            <Button variant={"outline"} asChild>
              <Link className="flex items-center" href={`/chatbot/${uuid4v()}`}>
                <Plus />
                Create New
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2 py-4 ">
            {chatbots.map((item, index) => (
              <div
                key={index}
                className="w-full h-[200px] shadow-sm rounded-sm p-6 cursor-pointer flex items-end justify-start font-medium font-inter border"
              >
                <Link href={`/chatbot/${item.id}`}>
                  <p>{item.title}</p>
                  <p className="text-sm">
                    {" "}
                    {item.updatedAt ? format(item.updatedAt, "PP") : "-"}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
