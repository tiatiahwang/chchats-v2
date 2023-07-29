import { ProviderType, RoleType } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      email: string;
      emailVerified: boolean | null;
      image: string | null;
      username: string | null;
      provider: ProviderType;
      role: RoleType;
    };
  }
}
