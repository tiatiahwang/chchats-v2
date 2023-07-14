import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import * as bcrypt from 'bcrypt';
import GoogleProvider from 'next-auth/providers/google';
import { nanoid } from 'nanoid';

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
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
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
    async jwt({ token, account }) {
      if (account?.provider === 'google') {
        // 로그인 시도한 이메일로 db에 저장되어 있는지 확인
        const checkUser = await db.user.findFirst({
          where: { email: token.email! },
        });

        if (checkUser && !checkUser.username) {
          // google 로그인시 가져오는 name이 db에 있는 username인지 확인
          const checkUsername = await db.user.findFirst({
            where: { username: token.name },
          });

          if (checkUsername) {
            // 만약에 username이 이미 존재한다면, random으로 username 업데이트
            await db.user.update({
              where: {
                id: checkUser.id!,
              },
              data: {
                username: nanoid(8),
                provider: 'GOOGLE',
              },
            });
          } else {
            // username이 존재하지 않는 경우, google 로그인시 가져오는 name으로 db의 username 업데이트
            await db.user.update({
              where: {
                id: checkUser.id!,
              },
              data: {
                username: token.name,
                provider: 'GOOGLE',
              },
            });
          }
        }
      }
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
          emailVerified: true,
          image: true,
          username: true,
          provider: true,
          role: true,
        },
      });
      session.user = user!;
      return session;
    },
  },
};
