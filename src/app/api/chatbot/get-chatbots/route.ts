import ChatbotController from '@/controllers/ChatbotController';
import { NextRequest, NextResponse } from 'next/server';
import errorHandler from '@/helpers/errorHandler';
import { getCurrentUser } from '@/next-auth/utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const chatbotControllerHandler = new ChatbotController();
    const response = await chatbotControllerHandler.getChatBotsByUserId(
      session?.user?.id || '',
    );

    let responseJson = {
      success: true,
      data: response,
      status: 200,
    };

    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
