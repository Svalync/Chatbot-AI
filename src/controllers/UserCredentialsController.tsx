import {prisma} from '@/lib/prisma';
import { UserCredentials } from '@prisma/client';

export default class userCredentialsController {
  async update(userId: string, companyName: string, companyDescription: string, companyUrl: string, companyLogo: string, tokenAmountToAdd: number, apiKey?: string) {
    let finalData = {
      userId: userId,
      tokens: BigInt(tokenAmountToAdd),
    };

    if (userId) {
      finalData['userId'] = userId;
    }

    if (companyName) {
      finalData['companyName'] = companyName;
    }

    if (companyDescription) {
      finalData['companyDescription'] = companyDescription;
    }

    if (companyUrl) {
      finalData['companyUrl'] = companyUrl;
    }

    if (companyLogo) {
      finalData['companyLogo'] = companyLogo;
    }

    if (tokenAmountToAdd) {
      finalData['tokens'] = BigInt(tokenAmountToAdd);
    }

    if (apiKey) {
      finalData['apiKey'] = apiKey;
    }

    try {
      const result = await prisma.userCredentials.upsert({
        where: { userId: userId },
        update: finalData,
        create: finalData,
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async updateAPIKeyByUserId(userId: string, apiKey: string) {
    let finalData = {};

    if (userId) {
      finalData['userId'] = userId;
    }

    if (apiKey) {
      finalData['apiKey'] = apiKey;
    }

    try {
      const result = await prisma.userCredentials.update({
        where: { userId: userId },
        data: finalData,
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  async updateUserCredential(userId: string, payload: any) {
    try {
      const result = await prisma.userCredentials.update({
        where: { userId: userId },
        data: payload,
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async updateTokens(userId: string, tokenAmountToAdd: number) {
    try {
      const result = await prisma.userCredentials.upsert({
        where: { userId: userId },
        update: {
          tokens: {
            increment: BigInt(tokenAmountToAdd),
          },
        },
        create: {
          userId: userId,
          tokens: BigInt(tokenAmountToAdd), // Set initial tokens if user does not exist
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async addTokens(userId: string, tokenAmountToAdd: number) {
    return await this.updateTokens(userId, tokenAmountToAdd);
  }

  async decreaseTokens(userId: string, tokenAmountToDecrease: number) {
    try {
      const result = await prisma.userCredentials.update({
        where: { userId: userId },
        data: {
          // Added 'data' key to specify the update
          tokens: {
            decrement: BigInt(tokenAmountToDecrease),
          },
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async getUserCrendentialByUserId(userId: string): Promise<UserCredentials | undefined> {
    try {
      const userCredential: UserCredentials | null = await prisma.userCredentials.findUnique({
        where: { userId: userId },
      });
      if (userCredential) {
        return userCredential;
      }
    } catch (e) {
      throw e;
    }
  }

  async getUserCrendentialByApiKey(apiKey: string): Promise<UserCredentials | undefined> {
    try {
      const userCredential: UserCredentials | null = await prisma.userCredentials.findFirst({
        where: { apiKey },
      });
      if (userCredential) {
        return userCredential;
      }
    } catch (e) {
      throw e;
    }
  }
}
