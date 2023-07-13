import { db } from '@/lib/db';
import { UserJoinValidator } from '@/lib/validator/user';
import * as bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, username } =
    UserJoinValidator.parse(body);

  const checkEmail = await db.user.findUnique({
    where: { email },
  });

  const checkUsername = await db.user.findUnique({
    where: { username },
  });

  if (checkEmail && checkUsername) {
    return new Response(
      '이미 사용중인 이메일과 닉네임 입니다.',
      { status: 409 },
    );
  }

  if (checkEmail) {
    return new Response('이미 사용중인 이메일 입니다.', {
      status: 409,
    });
  }

  if (checkUsername) {
    return new Response('이미 사용중인 닉네임 입니다.', {
      status: 409,
    });
  }

  await db.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      username,
    },
  });

  return new Response('OK');
}
