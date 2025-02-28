import userCredentialsController from '@/controllers/UserCredentialsController';
import errorHandler from '@/helpers/errorHandler';
import { getCurrentUser } from '@/next-auth/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCredentialsControllerHandler = new userCredentialsController();
    const data = await userCredentialsControllerHandler.getUserCrendentialByUserId(session.user.id || '');

    const response = JSON.parse(JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));

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
