
import { FileGlobal } from '@/app/components/FileUploaderInput';
import errorHandler from '@/helpers/errorHandler';
import imageKitInstance from '@/lib/imagkit';
import { getCurrentUser } from '@/next-auth/utils';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';
import IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: any = await req.json();

    const user: Session | null = await getCurrentUser();
    const imageKitInstanceHandler = new imageKitInstance();
    if (user && user.user && user.user.id) {
      imageKitInstanceHandler.setUserId(user.user.id);
    } else {
      const error = new errorHandler();
      error.noAuthenticationTokenError('Authentication Error');
      return error.generateError();
    }
    if (body.name && body.image) {
      const response: IKResponse<UploadResponse> = await imageKitInstanceHandler.uploadDocument(body.image, body.name || 'document');
      const returnJson: any = {
        status: 200,
        uploadedURL: response.filePath,
        success: true,
      };
      return NextResponse.json(returnJson);
    }

    const response: IKResponse<UploadResponse>[] = await imageKitInstanceHandler.uploadDocuments(body.files);
    let finalResponse: FileGlobal[] = [];
    for (let res of response) {
      finalResponse.push({
        filePath: res.filePath,
        type: res.name.split('.').pop() || 'unknown',
        filename: res.name,
        url: res.url,
      });
    }
    const returnJson: any = {
      status: 200,
      uploadedURL: finalResponse,
      success: true,
    };
    return NextResponse.json(returnJson);
  } catch (e: any) {
    const error = new errorHandler();
    error.internalServerError(e);
    return error.generateError();
  }
}
