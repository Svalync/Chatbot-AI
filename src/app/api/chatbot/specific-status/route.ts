import ChatbotContentController from '@/controllers/ChatbotContentController';

import errorHandler from '@/helpers/errorHandler';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const chatbotId = searchParams.get('id');

    const chatbotContentControllerHandler = new ChatbotContentController();
    const response = await chatbotContentControllerHandler.getChatbotContentByChatbotId(chatbotId as string);
    const responseJson = {
      status: 200,
      success: true,
      data: response,
    };
    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
