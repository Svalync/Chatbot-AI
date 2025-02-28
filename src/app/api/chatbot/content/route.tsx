import { chatbotState } from '@/features/slices/chatbotSlice';
import errorHandler from '@/helpers/errorHandler';
import { NextRequest, NextResponse } from 'next/server';
import { chatbotBackendImpl } from '@/features/backend/chatbotBackendImpl';
import { Session } from 'next-auth';
import { getCurrentUser } from '@/next-auth/utils';
import PDFJS from '@/lib/PDFJS';
import { ChatbotContentStatusType, chatbotContentType } from '@/schemas/chatbot.index';
import cronitorInstance from '@/lib/cronitor';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import astraDB from '@/lib/astraDB';
import ChatbotContentController from '@/controllers/ChatbotContentController';
import { getInitialUserState } from '@/features/slices/userSlice';

const processKnowledgeBaseData = async (chatbotContent: chatbotContentType[], collectionId: string, chatbotId: string) => {
  for (let content of chatbotContent) {
    // if (content.type?.includes('pdf')) {
    const chatbotContentControllerHandler = new ChatbotContentController();
    chatbotContentControllerHandler.upsertById(content.id, ChatbotContentStatusType.RUNNING, content.content, chatbotId);
    const pdfContent = await PDFJS.extractDataFromPDFLink(content.content);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 100,
    });
    const astraDBHandler = new astraDB();
    astraDBHandler.setSplitter(splitter);
    const collection = await astraDBHandler.createCollection('dot_product', collectionId);
    await astraDBHandler.addDataToCollection(pdfContent, collection);
    chatbotContentControllerHandler.upsertById(content.id, ChatbotContentStatusType.COMPLETED, pdfContent, chatbotId);
  }
  // }
};

export async function POST(req: NextRequest) {
  try {
    const body: chatbotState = await req.json();

    const user: Session | null = await getCurrentUser();
    let userAsUserState = getInitialUserState();

    if (user && user.user && user.user.id) {
      userAsUserState.id = user?.user.id;
      userAsUserState.email = user?.user.email || '';
    } else {
      const error = new errorHandler();
      error.noAuthenticationTokenError('Authentication Error');
      return error.generateError();
    }

    const chatbotBackendImplHandler = new chatbotBackendImpl();
    chatbotBackendImplHandler.initSuper(body);
    chatbotBackendImplHandler.setUser(userAsUserState);

    if (!chatbotBackendImplHandler.collectionId) {
      // TODO: GET Collection Id
    }

    const cronitorInstanceHandler = new cronitorInstance();
    cronitorInstanceHandler.wrapJob(
      'PROCESS_KNOWLEDGEBASE_DATA',
      processKnowledgeBaseData(chatbotBackendImplHandler.chatbotContent, chatbotBackendImplHandler.collectionId, chatbotBackendImplHandler.id),
    );
    // cronitorInstanceHandler.scheduleJob('PROCESS_KNOWLEDGEBASE_DATA', '* * * * *', processKnowledgeBaseData(chatbotBackendImplHandler.chatbotContent));
    const monitor = cronitorInstanceHandler.monitorJob('PROCESS_KNOWLEDGEBASE_DATA');
    try {
      monitor.start().then(() => {
        monitor.complete();
      });
    } catch (e: any) {
      monitor.fail();
      throw e;
    }

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
