import { z } from "zod";

enum useCaseEnum {
  Automate = "automate",
  Schedule = "schedule",
  Manage = "manage",
  Support = "support",
  Chat = "chat",
}

export const sendChatBotSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  useCase: z.nativeEnum(useCaseEnum),
  pathways: z.string().optional(),
  globalPrompt: z.string().optional(),
});

type SendChatBotSchemaType = z.infer<typeof sendChatBotSchema>;

export interface chatbotMessageContentType {
  role: string;
  content: string;
}

export interface ClaudeMessageType {
  role: string;
  content: { type: string; content: string }[];
}

export interface chatbotMessagesType {
  id: string;
  messages: chatbotMessageContentType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface chatBotsType {
  id: string;
  userId: string;
  title: string;
  useCase: useCaseEnum;
  messages?: chatbotMessagesType[];
  chatbotContent?: chatbotContentType[];
  pathways: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface chatbotContentType {
  id: string;
  content: string;
  name: string;
  status: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}
export enum ChatbotContentStatusType {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
}

export { useCaseEnum, type SendChatBotSchemaType };
