import ChatbotController from "@/controllers/ChatbotController";
import errorHandler from "@/helpers/errorHandler";
import { getCurrentUser } from "@/next-auth/utils";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const session: Session | null = await getCurrentUser();
    if (!session?.user?.id) {
      return NextResponse.json({
        error: "Unauthorized Access",
        success: false,
      });
    }
    const chabotControllerHandler = new ChatbotController();
    const response = await chabotControllerHandler.getChatBotsByUserId(
      session?.user?.id
    );
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
