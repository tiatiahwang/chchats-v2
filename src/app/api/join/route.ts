import { db } from '@/lib/db';
import { UserValidator } from '@/lib/validator/user';
import * as bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, username } =
    UserValidator.parse(body);

  const checkEmail = await db.user.findUnique({
    where: { email },
  });

  const checkUsername = await db.user.findUnique({
    where: { username },
  });

  if (checkEmail && checkUsername) {
    return new Response(
      '다른 이메일과 닉네임을 입력해 주세요.',
      { status: 409 },
    );
  }

  if (checkEmail) {
    return new Response('다른 이메일을 입력해 주세요.', {
      status: 409,
    });
  }

  if (checkUsername) {
    return new Response('다른 닉네임을 입력해 주세요.', {
      status: 409,
    });
  }

  await db.user.create({
    data: {
      email: email,
      password: await bcrypt.hash(password, 10),
      username: username,
    },
  });

  return new Response('OK');
}