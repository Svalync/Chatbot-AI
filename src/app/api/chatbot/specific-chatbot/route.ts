import ChatbotController from '@/controllers/ChatbotController';
import { chatbotBackendImpl } from '@/features/backend/chatbotBackendImpl';
import { chatbotState, getInitialChatbotState } from '@/features/slices/chatbotSlice';
import { getInitialUserState, userState } from '@/features/slices/userSlice';
import errorHandler from '@/helpers/errorHandler';
import { getCurrentUser } from '@/next-auth/utils';
import { useCaseEnum } from '@/schemas/chatbot.index';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id: string = searchParams.get('id') || '';

    const chatbotBackendImplHandler = new chatbotBackendImpl();

    if (id) {
      chatbotBackendImplHandler.setId(id);
    } else {
      const error = new errorHandler();
      error.notFoundWithMessage('No Id Given');
      return error.generateError();
    }

    const user: Session | null = await getCurrentUser();
    if (user && user.user && user.user.id) {
      const userStateObj: userState = getInitialUserState();
      userStateObj['id'] = user.user.id;
      userStateObj['email'] = user.user.email || userStateObj['email'];
      userStateObj['name'] = user.user.name || userStateObj['name'];
      chatbotBackendImplHandler.setUser(userStateObj);
    } else {
      const error = new errorHandler();
      error.noAuthenticationTokenError('Authentication Error');
      return error.generateError();
    }

    const chatbotControllerHandler = new ChatbotController();
    const response: chatbotState | undefined = await chatbotControllerHandler.getChatbotAllDetailsById(chatbotBackendImplHandler.id);

    if (response) {
      chatbotBackendImplHandler.initDataFromBackend(response);
    }

  
  
    const responseJson = {
      status: 200,
      success: true,
      data: chatbotBackendImplHandler,
    };
    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
