import userCredentialsController from "@/controllers/UserCredentialsController";
import errorHandler from "@/helpers/errorHandler";
import { getCurrentUser } from "@/next-auth/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session)
      return NextResponse.json({
        status: 401,
        message: "Unauthorized",
        success: false,
      });
    const userCredentialsControllerHandler = new userCredentialsController();
    const response: any =
      await userCredentialsControllerHandler.getUserCrendentialByUserId(
        session?.user?.id as string
      );

    const userData = {
      id: session?.user?.id,
      name: session?.user?.name,
      image: session?.user?.image,
      email: session?.user?.email,
      tokens: Number(response.tokens),
    };
    const returnJson: any = {
      status: 200,
      user: userData,
      success: true,
    };
    return NextResponse.json(returnJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
