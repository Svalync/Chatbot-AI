import ChatbotController from "@/controllers/ChatbotController";
import { chatbotState } from "@/features/slices/chatbotSlice";
import errorHandler from "@/helpers/errorHandler";
import { getCurrentUser } from "@/next-auth/utils";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: chatbotState = await req.json();

    const user: Session | null = await getCurrentUser();
    const chabotControllerHandler = new ChatbotController();
    const response = "";
    // await  chabotControllerHandler.create(
    //   body.title,
    //   body.knowledgeBase,
    //   body.useCase,
    //   body.userId,
    //   body.collectionId,
    //   body.pathways,
    //   body.globalPrompt
    // );

    const responsejson = {
      success: true,
      response: response,
      staus: 200,
    };
    return NextResponse.json(responsejson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
