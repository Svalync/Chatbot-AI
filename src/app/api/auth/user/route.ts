import errorHandler from "@/helpers/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const response = "";
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
