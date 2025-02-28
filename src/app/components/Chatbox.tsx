'use client';

import { Bot, ChevronRight, MessageCircleIcon, PlusIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { AppDispatch } from '@/store';

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
} from '@/features/slices/chatbotSlice';
import { cn } from '@/lib/utils';
import { chatbotMessageContentType, chatbotMessagesType } from '@/schemas/chatbot.index';
import { selectUser } from '@/features/slices/userSlice';
import configEnv from '@/config';
import MarkdownToHTML from './MarkdownToHTML';

// import { ChevronRight, MessageIcon, PlusIcon } from './Icons';
// import MarkdownToHTML from './MarkdownToHTML';

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
  const specificMessages: chatbotMessagesType | undefined = messages.find((message) => message.id === messageEntityId);



  const onSubmit = async (e) => {
    e.preventDefault();

    const inputPrompt = e.target.prompt.value;
    e.target.prompt.value = '';
    setChatLoading(true);
    if (!inputPrompt) return;
    const message = {
      role: 'user',
      content: inputPrompt,
    };

    await dispatch(setMessages({ messages: message }));
    await dispatch(generatePromptAnswerByChatbotIdAsync({ chatbotId: props.chatbotId }));
    setChatLoading(false);
  };

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
    <div className={isIframe ? 'grid h-screen grid-rows-[56px_1fr_48px] overflow-hidden' : 'grid h-full grid-rows-[56px_1fr_48px] overflow-hidden'}>
      <div className="gap-5border-border flex w-full flex-row items-center justify-between border-b px-[17px] py-[14px]">
        <div className="flex items-center gap-2">
          <Avatar className="size-[30px]">
            {/* <AvatarImage
              src={
                props.chatbotId !== '2eea2d39-6ab5-4955-a450-20ab6fbed974'
                  ? `${configEnv.imageKit.baseURL}/${chatbot.user?.userCredentials[0]?.companyLogo}`
                  : chatbot.user?.userCredentials[0]?.companyLogo
              }
              alt="@Support"
              className="size-[30px] border border-border"
            /> */}
            <AvatarFallback className="bg-secondary/30 text-secondary">{chatbot.title.charAt(0)}</AvatarFallback>
          </Avatar>

          <p className="font-inter text-base text-[#413735]">{chatbot.title}</p>
        </div>

        <div className="flex items-center gap-5">
          <div onClick={() => newChat()} className="cursor-pointer" title="New Chat">
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
            {showPreviousChats ? <X className="h-4 w-4" /> : <MessageCircleIcon />}
          </div>
        </div>
      </div>

      {showPreviousChats ? (
        <div className="relative flex h-full flex-col overflow-hidden bg-[#FD5B1D05]">
          <div className="overflow-y-auto scrollbar-thin scrollbar-track-secondary/10 scrollbar-thumb-secondary/65">
            {messages.map((message: chatbotMessagesType) => {
              return (
                <div
                  className="flex h-fit cursor-pointer items-center justify-between gap-2 border-b border-border px-[17px] py-[14px] hover:bg-secondary/10"
                  onClick={() => {
                    loadPreviousChats(message.id);
                  }}
                >
                  <Avatar className="size-9 rounded-full">
                    <AvatarFallback className="bg-secondary/30 text-secondary">{message?.messages[0]?.content.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 text-left">
                    <p className="line-clamp-1 text-sm text-foreground">{message?.messages[0]?.content}</p>
                    <p className="text-sm text-foreground/65">{message?.messages[1]?.content.substring(0, 40)}</p>
                  </div>
                  <ChevronRight />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative grid h-full grid-rows-[1fr_135px] overflow-hidden bg-[#FD5B1D05]">
          <div className="scrollbar-hide h-full space-y-4 overflow-y-auto px-[18px] pt-4">
            {specificMessages?.messages && specificMessages?.messages.length > 0 ? (
              specificMessages?.messages.map((message: chatbotMessageContentType, i) => <ChatMessage key={i} index={i} message={message} specificMessages={specificMessages} />)
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Bot className="size-14" />
                <h2 className="text-center font-bricolage text-xl font-normal text-foreground">Welcome to {chatbot.title}</h2>
                <p className="text-center font-inter text-base font-normal text-foreground/60">Ask me anything about {chatbot.title}</p>
              </div>
            )}

            {chatLoading ? (
              <div className="flex flex-col gap-2">
                <span className="mr-auto w-2/3 rounded-[4px] bg-secondary/10 p-2 font-inter text-[13px] font-medium text-foreground/65">
                  <div className="mb-[6px] w-fit rounded-[1px] bg-secondary/30 px-1.5 py-[3px] font-bricolage leading-4 text-secondary">AI</div>
                  Loading...
                </span>
              </div>
            ) : (
              <></>
            )}
          </div>
          <form ref={formRef} onSubmit={onSubmit} className="w-full p-[17px]">
            <div className="flex items-end justify-start gap-4 rounded-lg border bg-white">
              <Textarea
                name="prompt"
                id="prompt"
                rows={4}
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

      <div className="border-t border-border px-[17px] py-4 text-center font-inter text-[10px] font-medium text-foreground/50">
        Powered by{' '}
        <a className="text-secondary" target="_blank" href="https://svalync.com">
          Svalync
        </a>
      </div>
    </div>
  );
}
interface ChatMessageProps {
  index: number;
  message: chatbotMessageContentType;
  specificMessages: chatbotMessagesType;
}

function ChatMessage({ message, specificMessages, index }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (specificMessages?.messages.length - 1 == index && messageRef.current) {
      messageRef.current.scrollIntoView();
    }
  }, [specificMessages]);

  return (
    <div className="flex flex-col gap-2" ref={messageRef}>
      <p className={cn('w-2/3 rounded-[4px] bg-secondary/10 p-2 font-inter text-[13px] font-medium text-foreground/65', message.role === 'user' ? 'ml-auto self-end bg-[#F3F4F6]' : 'self-start')}>
        {message.role === 'user' ? (
          <div className="mb-[6px] w-fit rounded-[1px] bg-foreground/10 px-1.5 py-[3px] font-bricolage leading-4 text-foreground/65">User</div>
        ) : (
          <div className="mb-[6px] w-fit rounded-[1px] bg-secondary/30 px-1.5 py-[3px] font-bricolage leading-4 text-secondary">AI</div>
        )}
        <MarkdownToHTML content={message.content} />
      </p>
    </div>
  );
}
