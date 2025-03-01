"use client";

import {
  Bot,
  ChevronRight,
  MessageCircleIcon,
  PlusIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import configEnv from "@/config";
import {
  chatbotState,
  createNewChat,
  generatePromptAnswerByChatbotIdAsync,
  initChatbotMessagesFromBackendAsync,
  selectChatbot,
  selectMessageEntityId,
  selectMessages,
  setMessageEntityId,
  setMessages,
} from "@/features/slices/chatbotSlice";
import { cn } from "@/lib/utils";
import {
  chatbotMessagesType,
  StreamResponse,
  StremMessage,
} from "@/schemas/chatbot.index";
import { AppDispatch } from "@/store";

import {
  initUserFromBackendAsync,
  selectUser,
} from "@/features/slices/userSlice";
import io from "socket.io-client";
// import { ChevronRight, MessageIcon, PlusIcon } from "./Icons";
import MarkdownToHTML from "./MarkdownToHTML";

const SOCKET_SERVER_URL = "http://localhost:3001";

const socket = io(SOCKET_SERVER_URL, {
  reconnection: true, // Enables automatic reconnection
  reconnectionAttempts: 5, // Max attempts before failing
  reconnectionDelay: 1000, // Delay before trying to reconnect
  transports: ["websocket"], // Forces WebSocket connection
});

interface chatProps {
  chatbotId: string;
}

export default function ChatBox(props: chatProps) {
  const messages = useSelector(selectMessages);
  const formRef = useRef<HTMLFormElement | null>(null);
  const messageEntityId = useSelector(selectMessageEntityId);
  const user = useSelector(selectUser);
  const chatbot: chatbotState = useSelector(selectChatbot);
  const dispatch = useDispatch<AppDispatch>();
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [showPreviousChats, setShowPreviousChats] = useState<boolean>(false);
  const [isIframe, setIsIframe] = useState<boolean>(false);
  const specificMessages: chatbotMessagesType | undefined = messages.find(
    (message) => message.id === messageEntityId
  );
  const [streamedData, setStreamedData] = useState<StremMessage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const specificMessagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(initUserFromBackendAsync());

    if (socket.connected && chatbot) {
      const value = {
        userId: user?.id,
        chatbotId: chatbot.id,
      };

      socket.emit("stream", value);

      const handleStreamResponse = (data: StreamResponse) => {
        setStreamedData((prevMessages) => {
          let oldData = [...prevMessages];

          let newText = data.response;

          setChatLoading(false);
          // Ignore empty messages
          if (!newText) return oldData;
          // Ensure there's an active AI message
          if (
            oldData.length === 0 ||
            oldData[oldData.length - 1].role !== "system"
          ) {
            oldData.push({ role: "system", content: [] });
          }
          const lastMessage = oldData[oldData.length - 1];
          // Prevent duplicate content
          if (!lastMessage.content.includes(newText)) {
            lastMessage.content.push(newText);
          }

          return oldData.filter(
            (msg) => msg.role !== "system" || msg.content.length > 0
          ); // Remove empty AI messages
        });
      };

      socket.on("stream-response", handleStreamResponse);

      return () => {
        socket.off("stream-response", handleStreamResponse);
      };
    }
  }, [socket, chatbot]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const inputPrompt = e.target.prompt.value;
    e.target.prompt.value = "";
    setChatLoading(true);
    if (!inputPrompt) return;
    const message = {
      role: "user",
      content: inputPrompt,
    };
    setStreamedData((prev) => [...prev, message]);
    await dispatch(setMessages({ messages: message }));
    await dispatch(
      generatePromptAnswerByChatbotIdAsync({ chatbotId: props.chatbotId })
    );
    setActiveIndex((prev) => prev + 2);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [streamedData]);

  useEffect(() => {
    if (specificMessagesContainerRef.current) {
      specificMessagesContainerRef.current.scrollTop =
        specificMessagesContainerRef.current.scrollHeight;
    }
    if (specificMessages?.messages) {
      //@ts-ignore
      setStreamedData(specificMessages.messages);
    }
  }, [specificMessages]);

  const getPreviousChats = async () => {
    await dispatch(initChatbotMessagesFromBackendAsync());
    await setShowPreviousChats(!showPreviousChats);
  };

  const loadPreviousChats = async (messageEntityId: string) => {
    await dispatch(setMessageEntityId({ messageEntityId }));
    await setShowPreviousChats(false);
  };

  const newChat = async () => {
    dispatch(createNewChat());
    setShowPreviousChats(false);
  };

  return (
    <div className="grid h-full grid-rows-[56px_1fr_48px] overflow-hidden border-[#D7D3C9]  border rounded-2xl">
      <div className="gap-5  flex w-full flex-row items-center justify-between border-b border-[#D7D3C9]  px-[17px] py-[14px]">
        <div className="flex items-center gap-2">
          <Avatar className="size-[30px] border">
            <AvatarImage
              src={
                props.chatbotId !== "2eea2d39-6ab5-4955-a450-20ab6fbed974"
                  ? `${configEnv.imageKit.baseURL}/${chatbot.user?.userCredentials[0]?.companyLogo}`
                  : chatbot.user?.userCredentials[0]?.companyLogo
              }
              alt="@Support"
              className="size-[30px] border border-[#D7D3C9] "
            />
            <AvatarFallback className="bg-secondary/30 text-secondary">
              {chatbot.title.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <p className="font-inter text-base text-[#413735]">{chatbot.title}</p>
        </div>

        <div className="flex items-center gap-5">
          <div
            onClick={() => newChat()}
            className="cursor-pointer"
            title="New Chat"
          >
            <PlusIcon />
            <span className="sr-only">New Chat</span>
          </div>
          <div
            className="cursor-pointer"
            title="Show Previous Chats"
            onClick={() => {
              getPreviousChats();
            }}
          >
            {showPreviousChats ? (
              <X className="h-4 w-4" />
            ) : (
              <MessageCircleIcon />
            )}
          </div>
        </div>
      </div>

      {showPreviousChats ? (
        <div className="relative flex h-full flex-col overflow-hidden bg-[#FD5B1D05]">
          <div className="overflow-y-auto scrollbar-thin scrollbar-track-secondary/10 scrollbar-thumb-secondary/65">
            {messages.map((message) => {
              return (
                <div
                  className="flex h-fit cursor-pointer items-center justify-between gap-2 border-b border-[#D7D3C9]  px-[17px] py-[14px] hover:bg-secondary/10"
                  onClick={() => {
                    loadPreviousChats(message.id);
                  }}
                >
                  <Avatar className="size-9 rounded-full">
                    <AvatarFallback className="bg-secondary/30 text-secondary">
                      {message?.messages[0]?.content.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 text-left">
                    <p className="line-clamp-1 text-sm text-foreground">
                      {message?.messages[0]?.content}
                    </p>
                    <p className="text-sm text-foreground/65">
                      {message?.messages[1]?.content.substring(0, 30)}
                    </p>
                  </div>
                  <ChevronRight />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative grid h-full grid-rows-[1fr_100px] overflow-hidden bg-[#FD5B1D05]">
          {
            <div
              ref={chatContainerRef}
              className="scrollbar-hide h-full space-y-4 overflow-y-auto px-[18px] pb-4 pt-4"
            >
              {streamedData.length > 0 ? (
                streamedData.map((message: StremMessage, i: number) => {
                  return (
                    <ChatMessage
                      key={i}
                      index={i}
                      message={message}
                      activeIndex={activeIndex}
                    />
                  );
                })
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                  <Bot className="size-14" />
                  <h2 className="text-center font-bricolage text-xl font-normal text-foreground">
                    Welcome to {chatbot.title}
                  </h2>
                  <p className="text-center font-inter text-base font-normal text-foreground/60">
                    Ask me anything about {chatbot.title}
                  </p>
                </div>
              )}
              {chatLoading && (
                <div className="flex w-fit gap-1 rounded-[4px] bg-secondary/10 p-2 font-inter text-[13px] font-medium text-foreground/65">
                  <p className="w-fit rounded-[1px] bg-secondary/30 px-1.5 py-[3px] font-bricolage leading-4 text-secondary">
                    AI
                  </p>
                  <span className="animate-bounce font-bold text-secondary">
                    ...
                  </span>
                </div>
              )}
            </div>
          }
          <form ref={formRef} onSubmit={onSubmit} className="w-full p-[17px]">
            <div className="flex items-end justify-start gap-4 rounded-lg border border-[#D7D3C9]  bg-white">
              <Textarea
                name="prompt"
                id="prompt"
                onKeyDown={(e) => {
                  if (e.keyCode == 13 && e.shiftKey == false) {
                    e.preventDefault();
                    if (formRef.current) {
                      formRef.current.requestSubmit();
                    }
                  }
                }}
                placeholder="Ask me any question"
                onChange={(e) => e.target.value}
                className="inset-0 w-full border-0 px-3 py-2.5 pr-5 font-inter text-[13px] text-foreground/65 shadow-none placeholder:text-foreground/50 focus-visible:ring-0"
              />
              <button className="h-fit w-fit p-1.5" type="submit">
                <ChevronRight />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border-t border-[#D7D3C9]  px-[17px] py-4 text-center font-inter text-[10px] font-medium text-foreground/50">
        Powered by{" "}
        <a
          className="text-secondary"
          target="_blank"
          href="https://svalync.com"
        >
          Svalync
        </a>
      </div>
    </div>
  );
}
interface ChatMessageProps {
  index: number;
  message: StremMessage;
  activeIndex: number;
}

function ChatMessage({ message, index, activeIndex }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageRef.current && activeIndex === index) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [activeIndex, index]);

  return (
    <div className="flex flex-col gap-2 " ref={messageRef}>
      <p
        className={cn(
          "w-2/3 rounded-[4px] bg-secondary/10 p-2 font-inter text-[13px] font-medium text-foreground/65",
          message.role === "user"
            ? "ml-auto self-end bg-[#F3F4F6]"
            : "self-start"
        )}
      >
        {message.role === "user" ? (
          <p className="mb-[6px] w-fit rounded-[1px] bg-foreground/10 px-1.5 py-[3px] font-bricolage leading-4 text-foreground/65">
            User
          </p>
        ) : (
          <p className="mb-[6px] w-fit rounded-[1px] bg-secondary/30 px-1.5 py-[3px] font-bricolage leading-4 text-secondary">
            AI
          </p>
        )}
        <MarkdownToHTML
          content={
            typeof message.content == "string"
              ? message.content
              : message.content.join("")
          }
        />
      </p>
    </div>
  );
}
