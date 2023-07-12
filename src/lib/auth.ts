import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import * as bcrypt from 'bcrypt';
import { UserLoginValidator } from './validator/user';
import axios from 'axios';
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
        // const res = await fetch(
        //   `${process.env.NEXTAUTH_URL}/api/login`,
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       email: credentials?.email,
        //       password: credentials?.password,
        //     }),
        //   },
        // );

        // const user = await res.json();
        // console.log('CREDENTIAL LOGIN', user);

        // if (user) {
        //   return user;
        // }
        // return Promise.reject(new Error());

        const { data: user } = await axios.post(
          `${process.env.NEXTAUTH_URL}/api/login`,
          {
            email: credentials?.email,
            password: credentials?.password,
          },
        );

        if (user) {
          return user;
        } else {
          return null;
        }
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
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};
