import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import * as bcrypt from 'bcrypt';
import { UserLoginValidator } from './validator/user';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';
// import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error(
            '잘못된 요청으로 인해 오류가 발생했습니다.',
          );
        }

        const user = await db.user.findFirst({
          where: { email: credentials?.email },
        });

        if (!user) {
          throw new Error(
            '가입되어 있지 않은 이메일 입니다.',
          );
        }

        const checkPassword = await bcrypt.compare(
          credentials?.password,
          user?.password!,
        );

        if (!checkPassword) {
          throw new Error('비밀번호를 다시 확인해주세요.');
        }

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      const user = await db.user.findUnique({
        where: {
          email: session.user?.email!,
        },
        select: {
          id: true,
          email: true,
          image: true,
          username: true,
          emailVerified: true,
        },
      });
      session.user = user!;
      return session;
    },
  },
};
