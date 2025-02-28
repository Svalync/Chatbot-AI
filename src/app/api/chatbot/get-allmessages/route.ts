import ChatbotMessagesController from '@/controllers/ChatbotMessagesController';
import { chatbotBackendImpl } from '@/features/backend/chatbotBackendImpl';
import errorHandler from '@/helpers/errorHandler';
import { chatbotMessagesType } from '@/schemas/chatbot.index';
import { ChatbotMessages } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const chatbotId = searchParams.get('chatbotId');
    const chatbotBackendImplHandler = new chatbotBackendImpl();

    if (chatbotId) {
      chatbotBackendImplHandler.setId(chatbotId);
      const chatbotMessagesControllerHandler = new ChatbotMessagesController();
      const chatbotMessages: ChatbotMessages[] | undefined =
        await chatbotMessagesControllerHandler.getMessagesByChatbotId(
          chatbotBackendImplHandler.id,
        );
      if (chatbotMessages && chatbotMessages.length > 0) {
        for (let chatbotMessage of chatbotMessages) {
          const messageHistory: chatbotMessagesType = {
            id: chatbotMessage.id,
            messages: JSON.parse(chatbotMessage.messages),
            createdAt: chatbotMessage.createdAt
              ? chatbotMessage.createdAt.toISOString()
              : '',
            updatedAt: chatbotMessage.updatedAt
              ? chatbotMessage.updatedAt.toISOString()
              : '',
          };
          chatbotBackendImplHandler.pushMessageHistory(messageHistory);
        }
      }
    }

    let responseJson = {
      success: true,
      data: chatbotBackendImplHandler.getChatbotImplVariables(),
      status: 200,
    };

    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
