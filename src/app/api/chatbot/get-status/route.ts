import { NextRequest, NextResponse } from "next/server";
import errorHandler from "@/helpers/errorHandler";
import ChatbotContentController from "@/controllers/ChatbotContentController";
import { getCurrentUser } from "@/next-auth/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const chatbotContentControllerHandler = new ChatbotContentController();
    // TODO: Fix this convert getChatbotContentByUserId to getChatbotContentByChatbotId
    // const response =
    //   await chatbotContentControllerHandler.getChatbotContentByUserId(
    //     session?.user?.id as string,
    //   );
    const responseJson = {
      status: 200,
      success: true,
      // data: response,
    };
    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
