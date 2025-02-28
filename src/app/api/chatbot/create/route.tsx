import ChatbotController from "@/controllers/ChatbotController";
import { chatbotBackendImpl } from "@/features/backend/chatbotBackendImpl";
import { chatbotState } from "@/features/slices/chatbotSlice";
import { getInitialUserState } from "@/features/slices/userSlice";
import errorHandler from "@/helpers/errorHandler";
import { getCurrentUser } from "@/next-auth/utils";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function generateCollectionId() {
  return `collection_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: chatbotState = await req.json();
    console.log(body);
    const user: Session | null = await getCurrentUser();
    console.log(user)
    if (!user) {
      return NextResponse.json({
        "Authorize":"not"
      }); // Correct
      // ed to return the response
    }
    let userAsUserState = getInitialUserState();

    if (user && user.user && user.user.id) {
      userAsUserState.id = user?.user.id;
      userAsUserState.email = user?.user.email || "";
    } else {
      const error = new errorHandler();
      error.noAuthenticationTokenError("Authentication Error");
      return error.generateError();
    }

    const chatbotBackendImplHandler = new chatbotBackendImpl();
    chatbotBackendImplHandler.initSuper(body);
    chatbotBackendImplHandler.setUser(userAsUserState);

    if (!chatbotBackendImplHandler.collectionId) {
      const collectionId: string = generateCollectionId();
      chatbotBackendImplHandler.setCollectionId(collectionId);
    }

    const chatbotControllerHandler = new ChatbotController();
    const result: any = await chatbotControllerHandler.upsert(
      chatbotBackendImplHandler.id,
      chatbotBackendImplHandler.title,
      chatbotBackendImplHandler.globalPrompt,
      chatbotBackendImplHandler.user?.id || "",
      chatbotBackendImplHandler.collectionId,
      chatbotBackendImplHandler.useCase,
      chatbotBackendImplHandler.pathways
    );
    const responseJson = {
      success: true,
      status: 200,
    };

    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
