import ChatbotController from "@/controllers/ChatbotController";
import errorHandler from "@/helpers/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id: string = searchParams.get("id") || "";

    const chabotControllerHandler = new ChatbotController();
    const response = await chabotControllerHandler.getChatbotById(id);
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
