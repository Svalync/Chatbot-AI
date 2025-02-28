import { z } from 'zod';

export interface userCredentialType {
  id: string;
  userId: string;
  tokens: number;
  companyName: string;
  companyDescription: string;
  companyUrl: string;
  companyLogo: string;
}
export const userCredentialFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyDescription: z.string().min(1, 'Description is required'),
  companyUrl: z.string().url().optional(),
  companyLogo: z.any().optional(),
});

export type UserCredentialFormSchemaType = z.infer<
  typeof userCredentialFormSchema
>;
