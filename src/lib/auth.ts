import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import * as bcrypt from 'bcrypt';
import { UserValidator } from './validator/user';
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
        const { email, password } =
          UserValidator.parse(credentials);
        const user = await db.user.findFirst({
          where: { email },
        });

        //TODO: error message 추가하기
        if (!user) return null;

        const checkPassword = await bcrypt.compare(
          password,
          user.password!,
        );

        //TODO: error message 추가하기
        if (!checkPassword) return null;

        return user;
        // const res = await fetch(
        //   `${process.env.NEXTAUTH_URL}/api/login`,
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       email: formData?.email,
        //       password: formData?.password,
        //     }),
        //   },
        // );
        // const user = await res.json();
        // console.log(user);
        // if (user) {
        //   return user;
        // } else {
        //   return null;
        // }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET,
};
