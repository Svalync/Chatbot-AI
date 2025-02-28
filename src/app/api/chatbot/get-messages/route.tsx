import ChatbotMessagesController from '@/controllers/ChatbotMessagesController';
import { chatbotImpl } from '@/features/logic/chatbotImpl';
import errorHandler from '@/helpers/errorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId') || '';

    
    const chatbotMessagesControllerHandler = new ChatbotMessagesController();
    const messages: any =
      await chatbotMessagesControllerHandler.getMessagesBySessionId(sessionId);

    for (let message of messages) {
      message['messages'] = JSON.parse(message.messages);
    }
    const chatbotImplHandler = new chatbotImpl();
    chatbotImplHandler.setMessages(messages);

    let responseJson = {
      success: true,
      data: chatbotImplHandler.toJson(),
      status: 200,
    };

    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
