import { NextRequest, NextResponse } from "next/server";

import { chatbotBackendImpl } from "@/features/backend/chatbotBackendImpl";
import { chatbotState } from "@/features/slices/chatbotSlice";

import errorHandler from "@/helpers/errorHandler";
import ChatbotExecutor from "@/utils/chatbot/ChatbotExecutor";

import ChatbotController from "@/controllers/ChatbotController";
import ChatbotMessagesController from "@/controllers/ChatbotMessagesController";
import { chatbotMessageContentType } from "@/schemas/chatbot.index";
import { ChatbotMessages, Chatbots } from "@prisma/client";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: chatbotState = await req.json();

    const ipAddress: string =
      // @ts-ignore
      req.ip ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "Unknown IP";
    const userAgent: string = req.headers.get("user-agent") || "";

    const chatbotBackendImplHandler = new chatbotBackendImpl();
    chatbotBackendImplHandler.initSuper(body);
    chatbotBackendImplHandler.setIpAddress(ipAddress);
    chatbotBackendImplHandler.setUserAgent(userAgent);
    const chatbotControllerHandler = new ChatbotController();
    const chatbot: Chatbots | undefined =
      await chatbotControllerHandler.getChatbotById(
        chatbotBackendImplHandler.getId()
      );

    if (chatbot) {
      chatbotBackendImplHandler.setGlobalPrompt(
        `${chatbot?.globalPrompt} 


          Rules:
          - Always Return Output in Markdown Format
          - Always add breaks between 2 paragraphs
          - Add line breaks between paragraphs using <br>.  
          - Utilize bullet points or numbered lists where necessary.  
          - Apply bold, italics, or code formatting to highlight key details.  

          ` ||
          `You are an AI-powered customer support assistant for Skyscanner designed to assist users with their inquiries. Your goal is to provide accurate, helpful, and friendly responses to customer questions based on the provided context. Always:

          - Be polite and professional.
          - Offer clear and concise information.
          - Maintain a helpful, empathetic tone.
          - If the answer is not within the provided context, politely inform the user that you are unable to answer the question.
          - Address queries related to product information, troubleshooting, account issues, and more.
          - Ask clarifying questions when needed to better understand the user's issue.
          - Do not make assumptions. Always verify the details if necessary.
          - If the prompt is not something related to company. Tell them you can't answer politely
          - Always include company name, where ever necessary
          - Don't tell user that your are an AI powered chatbot
          - Use the language which is specified. Don't use any other langugage **very Strict Rule**
          - Even if the person is using any other language. You should respond in the language which is specified

      
          Company Name: Skyscanner
          Company Website: https://www.skyscanner.co.in/
          -----------------`
      );
      chatbotBackendImplHandler.setCollectionId(chatbot?.collectionId || "");
      chatbotBackendImplHandler.setPathways(chatbot?.pathways || "9999");
    }

    if (!chatbot) {
      const error = new errorHandler();
      error.notFoundWithMessage("No Chatbot Found with this Id");
      return error.generateError();
    }

    const chatbotMessagesControllerHandler = new ChatbotMessagesController();
    // last editor State Checkpoint
    let chatbotMessagesData: ChatbotMessages | undefined =
      await chatbotMessagesControllerHandler.getEditorStateById(
        chatbotBackendImplHandler.messages[0].id
      );

   
    const chatbotExecutorHandler = new ChatbotExecutor(
      chatbotBackendImplHandler.messages[0]?.messages || []
    );

    chatbotExecutorHandler.initFromChatbotBackendImpl(
      chatbotBackendImplHandler
    );

    // if (chatbotBackendImplHandler.chatbotEditorStateCheckpoint) {
    //   chatbotExecutorHandler.setStateCurrentNode(
    //     chatbotBackendImplHandler.chatbotEditorStateCheckpoint.currentNode
    //   );
    //   chatbotExecutorHandler.setStateNextNode(
    //     chatbotBackendImplHandler.chatbotEditorStateCheckpoint.nextNode
    //   );
    //   chatbotExecutorHandler.setStateResponses(
    //     chatbotBackendImplHandler.chatbotEditorStateCheckpoint.responses
    //   );
    // }

    const responseMessage: chatbotMessageContentType | undefined =
      await chatbotExecutorHandler.executeChatbot();
    // const responseMessage: chatbotMessageContentType | undefined = {
    //   role: 'system',
    //   content:
    //     "Thank you for your interest in Zifto's customers! We're proud to have served some notable individuals. Here are a few of our esteemed customers:\n\n1. **S. Jaishankar**: We had the honor of creating a stunning, colored handmade painting for India's External Affairs Minister and his wife. This piece beautifully captures a cherished moment of their lives.\n\n2. **Shubman Gill**: We crafted a special piece for this talented cricketer, though the specific details aren't provided in the context.\n\n3. **Sunil Grover**: We created a fandom gift for the popular comedian and actor. It's a minimalistic black-and-white painting that captures his iconic charm with simplicity and style.\n\nThese are just a few examples of our notable customers. At Zifto, we take pride in bringing smiles to over 1 million happy customers across India with our personalized gifts and handmade paintings. Whether it's for celebrities or everyday individuals, we put the same level of care and artistry into each piece we create.\n\nIs there anything specific you'd like to know about our customers or our services?",
    // };

    if (responseMessage) {
      chatbotBackendImplHandler.addMessages(
        chatbotBackendImplHandler.messages[0].id,
        responseMessage
      );
    }

    await chatbotMessagesControllerHandler.upsertById(
      chatbotBackendImplHandler.messages[0].id,
      JSON.stringify(chatbotBackendImplHandler.messages[0].messages),
      chatbotBackendImplHandler.id,
      chatbotBackendImplHandler.sessionId,
      chatbotBackendImplHandler.ipAddress || "",
      chatbotBackendImplHandler.userAgent || "",
    );

    const responseJson = {
      success: true,
      status: 200,
      data: responseMessage,
    };
    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
