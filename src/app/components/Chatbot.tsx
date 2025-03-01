"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import {
  chatbotState,
  createChatbotAsync,
  initSpecificChatbotFromBackendAsync,
  selectChatbot,
  setChatbotContent,
  setChatbotId,
  setChatbotState,
  uploadFilesToVectorDatabaseAsync,
} from "@/features/slices/chatbotSlice";

import {
  ChatbotContentStatusType,
  chatbotContentType,
  SendChatBotSchemaType,
  useCaseEnum,
} from "@/schemas/chatbot.index";
import { AppDispatch } from "@/store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { useParams } from "next/navigation";
// import CodeUsage from './CodeUsage';
import FileUploaderInput, { FileGlobal } from "./FileUploaderInput";
import ChatBox from "./Chatbox";
import Navbar from "./Navbar";
import Loader from "./Loader";
import Link from "next/link";
import { Logo } from "../SVG/Icon";

export default function Chatbot() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const [sidebarState, setSidebarState] = useState(false);
  const [docIndex, setDocIndex] = useState<number | null>(null);

  const chatbot: chatbotState = useSelector(selectChatbot);

  useEffect(() => {
    if (params.chatId) {
      dispatch(setChatbotId({ id: params.chatId as string }));
      dispatch(initSpecificChatbotFromBackendAsync(params.chatId as string));
    }
  }, []);

  const form = useForm<SendChatBotSchemaType>({
    defaultValues: {
      title: "Untitled Chatbot",
      useCase: useCaseEnum.Support,
      pathways: "chatbotEditors[0]?.id",
      globalPrompt: "",
    },
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await dispatch(createChatbotAsync());
    toast({
      title: "Chatbot Saved!",
    });
  };

  const onUploadDocs = async (e: any, data) => {
    e.preventDefault();
  };

  function onChange(e, selectInputName: string | undefined = undefined) {
    if (selectInputName) {
      const name = selectInputName;
      const value = e;
      dispatch(setChatbotState({ key: name, value }));
    } else {
      const name = e.target.name;
      const value = e.target.value;
      dispatch(setChatbotState({ key: name, value }));
    }
  }
  const HandleDocsSheet = (id: number) => {
    setDocIndex(id);
    setSidebarState(true);
  };
  const resetSidebar = (value: boolean) => {
    setSidebarState(value);
    setDocIndex(null);
  };

  const uploadFiles = (files: FileGlobal[]) => {
    const chatbotContent: chatbotContentType[] = [];
    for (let file of files) {
      chatbotContent.push({
        id: uuidv4(),
        content: file.url || "",
        name: file.filename,
        type: file.type,
        status: ChatbotContentStatusType.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    dispatch(setChatbotContent({ chatbotContent }));
  };

  const onUploadFilesToVectorDatabase = () => {
    dispatch(uploadFilesToVectorDatabaseAsync());
    toast({
      title: "File Uploading",
    });
  };
  return (
    <div className="grid h-screen grid-rows-[65px_1fr] overflow-hidden bg-[#FD5B1D05]">
      <div className="border-b flex items-center gap-5 px-5 py-2 h-full">
        <Link className="text-orange-500 text-2xl" href="/">
          <Logo />
        </Link>

        <div>
          <h3 className="font-bricolage text-xl font-medium text-foreground">
            {chatbot?.title ? chatbot?.title : "Untitled Chatbot"}
          </h3>
          <p className="font-inter text-sm font-medium text-foreground/50">
            Chatbot Id: {chatbot?.id}
          </p>
        </div>
      </div>

      <div className="grid h-full grid-cols-[25%_1fr_25%] grid-rows-1 overflow-hidden p-4 gap-5">
        <div className="mt-0 border border-[#D7D3C9]  rounded-2xl grid h-full">
          <Form {...form}>
            <form
              className="grid h-full grid-rows-[1fr_56px]"
              onSubmit={onSubmit}
            >
              <div className="flex h-full flex-col gap-3 px-[23px] py-[31px]">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bricolage text-[13px] font-medium text-foreground">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border border-black/35 font-inter text-[13px] text-foreground/65 placeholder:text-foreground/65"
                          placeholder="Title"
                          value={chatbot?.title || ""}
                          onChange={(e) => onChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="useCase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bricolage text-[13px] font-medium text-foreground">
                        Use Case
                      </FormLabel>
                      <Select
                        onValueChange={(e) => onChange(e, field.name)}
                        value={chatbot.useCase || field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none border border-black/35 font-inter text-[13px] font-medium text-foreground/65">
                            <SelectValue placeholder="Select a Voice Model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value={useCaseEnum.Automate}>
                            Automate
                          </SelectItem>
                          <SelectItem value={useCaseEnum.Chat}>Chat</SelectItem>
                          <SelectItem value={useCaseEnum.Manage}>
                            Manage
                          </SelectItem>
                          <SelectItem value={useCaseEnum.Schedule}>
                            Schedule
                          </SelectItem>
                          <SelectItem value={useCaseEnum.Support}>
                            Support
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="globalPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bricolage text-[13px] font-medium text-foreground">
                        Global Prompt
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="rounded-none border border-black/35 font-inter text-[13px] text-foreground/65 placeholder:text-foreground/65"
                          placeholder="Global Prompt"
                          value={chatbot?.globalPrompt || ""}
                          onChange={(e) => onChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full justify-end border-t border-[#D7D3C9] items-center px-[14px] py-1.5">
                <Button
                  type="submit"
                  variant="outline"
                  className="px-[17px] cursor-pointer"
                >
                  {chatbot ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>{" "}
        </div>
        {chatbot.loading ? (
          <Loader />
        ) : (
          chatbot.id && <ChatBox chatbotId={chatbot.id} />
        )}
        <div className="mt-0 grid h-full grid-rows-[1fr_56px] overflow-hidden border border-[#D7D3C9]  rounded-2xl">
          <div className="grid grid-rows-[205px_1fr] overflow-hidden">
            <div className="px-[23px] py-[30px]">
              <FileUploaderInput callback={uploadFiles} />
            </div>
            <div className="overflow-y-auto scrollbar-thin scrollbar-track-secondary/10 scrollbar-thumb-secondary/65">
              <div className="relative grid w-full grid-cols-[43%_auto_auto] text-left">
                <div className="sticky top-0 col-span-3 grid grid-cols-subgrid">
                  <div className="border border-[#D7D3C9]  border-x-0 bg-white p-3 font-bricolage text-[13px] font-medium text-foreground">
                    Document
                  </div>
                  <div className="border border-[#D7D3C9]  bg-white p-3 font-bricolage text-[13px] font-medium text-foreground">
                    Status
                  </div>
                  <div className="border border-[#D7D3C9]  border-x-0 bg-white p-3 font-bricolage text-[13px] font-medium text-foreground">
                    Details
                  </div>
                </div>

                {chatbot?.chatbotContent.map(
                  (item: chatbotContentType, idx) => (
                    <div
                      key={idx}
                      className="col-span-3 grid grid-cols-subgrid"
                    >
                      <div className="cursor-pointer border-b border-[#D7D3C9]  p-3 font-inter text-[13px] font-medium text-foreground/65">
                        {item.id}
                      </div>
                      <div
                        className={cn(
                          "cursor-pointer border-b border-[#D7D3C9]  p-3 font-inter text-[13px] font-medium",
                          item.status === "pending"
                            ? "text-red-500"
                            : "text-green-500"
                        )}
                      >
                        {item.status === "pending" ? "PENDING" : "Completed"}
                      </div>
                      <div className="cursor-pointer border-b border-[#D7D3C9]  p-3 font-inter text-[13px] font-medium">
                        <Button
                          type="button"
                          onClick={() => HandleDocsSheet(idx)}
                          className="flex items-center gap-1"
                        >
                          View
                          <ArrowRightIcon className="size-4 font-medium" />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end border-t border-[#D7D3C9]  px-[14px] py-1.5">
            <Button
              type="submit"
              variant={"outline"}
              className="px-[17px cursor-pointer"
              onClick={onUploadFilesToVectorDatabase}
            >
              Upload
            </Button>
          </div>
          <Sheet open={sidebarState} onOpenChange={resetSidebar}>
            <SheetContent className="grid h-screen grid-rows-[65px_1fr_40px] gap-0 p-0! sm:max-w-[547px] bg-white">
              <SheetHeader className="border-b border-[#D7D3C9] ">
                <SheetTitle className=" font-bricolage text-[13px] font-medium text-foreground/65">
                  {docIndex !== null
                    ? chatbot.chatbotContent[docIndex].id
                    : null}
                  <p className="font-inter text-[10px] font-medium text-foreground/50">
                    Document Id:{" "}
                    {docIndex !== null
                      ? chatbot.chatbotContent[docIndex].id
                      : null}
                  </p>
                </SheetTitle>
              </SheetHeader>
              <div className="border-[#D7D3C9]  px-[13px] py-2.5">
                <div className="flex items-center justify-between border-b border-[#D7D3C9]  px-[5px] py-2.5 font-inter text-[13px] font-medium text-foreground">
                  <p>Document Name</p>
                  <p className="text-foreground/65"></p>
                </div>
                <div className="flex items-center justify-between border-b border-[#D7D3C9]  px-[5px] py-2.5 font-inter text-[13px] font-medium text-foreground">
                  <p>Status</p>
                  <p
                    className={cn(
                      "uppercase text-foreground/65",
                      docIndex !== null &&
                        chatbot.chatbotContent[docIndex]?.status === "pending"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {docIndex !== null
                      ? chatbot.chatbotContent[docIndex].status
                      : null}
                  </p>
                </div>
                <div className="flex items-center justify-between px-[5px] py-2.5 font-inter text-[13px] font-medium text-foreground">
                  <p>Created At</p>
                  <p className="text-foreground/65">
                    {docIndex !== null
                      ? format(
                          new Date(
                            chatbot.chatbotContent[docIndex].createdAt ?? ""
                          ),
                          "PP"
                        )
                      : null}
                  </p>
                </div>

                <div className="h-[calc(100vh-265px)] w-full overflow-hidden border border-[#D7D3C9]  sm:w-[520px]">
                  <div className="w-full border-b px-[15px] py-[18px]">
                    <p className="font-bricolage text-[13px] font-medium text-foreground">
                      Content
                    </p>
                  </div>
                  <div className="h-[calc(100%-56px)] w-full overflow-y-auto border-[#D7D3C9]  px-3 py-5 scrollbar-thin scrollbar-track-secondary/10 scrollbar-thumb-secondary/65">
                    {docIndex !== null
                      ? chatbot.chatbotContent[docIndex].content
                      : null}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-[#D7D3C9]  px-[5px] py-2.5 font-inter text-[13px] font-medium text-foreground"></div>
              </div>
              <div className="mt-auto flex items-center justify-center border-t border-[#D7D3C9]  bg-white py-[14px] text-center font-inter text-[10px] font-medium text-foreground/50 shadow-[0px_-3px_20px_0px_#0000000A]"></div>
            </SheetContent>
          </Sheet>{" "}
        </div>
      </div>
    </div>
  );
}
