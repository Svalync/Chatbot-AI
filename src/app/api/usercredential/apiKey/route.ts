import { NextRequest, NextResponse } from 'next/server';
import errorHandler from '@/helpers/errorHandler';
import userCredentialsController from '@/controllers/UserCredentialsController';
import { getCurrentUser } from '@/next-auth/utils';

export async function POST(req: NextRequest ) {
  try {
    const body: any = await req.json();
    const session = await getCurrentUser();

    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userCredentialsControllerHandler = new userCredentialsController();
    await userCredentialsControllerHandler.update(session.user.id || '', '', '', '', '', 0, body.apiKey);

    let responseJson = {
      success: true,
      data: { apiKey: body.apiKey },
      status: 200,
    };

    return NextResponse.json(responseJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
