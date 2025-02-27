import { auth } from '@/auth';

export const getCurrentUser = async () => {
  return await auth();
};
