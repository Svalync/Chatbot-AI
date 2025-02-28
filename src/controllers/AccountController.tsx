import {prisma} from '@/lib/prisma';

export default class accountController {
  async getAccountByProviderAndProviderAccountId(
    provider: string,
    providerAccountId: string,
  ) {
    try {
      const whereJson = {
        provider: provider,
        providerAccountId: providerAccountId,
      };
      const result = await prisma.account.findFirst({
        where: whereJson,
      });
      return result;
    } catch (e) {
      return e;
    }
  }

  async getAccountByAccountId(accountId: string) {
    try {
      const result = await prisma.account.findFirst({
        where: {
          id: accountId,
        },
      });
      return result;
    } catch (e) {
      return e;
    }
  }
}
