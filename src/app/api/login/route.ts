import { db } from '@/lib/db';
import { signJwtAccessToken } from '@/lib/jwt';
import * as bcrypt from 'bcrypt';

interface RequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  const user = await db.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (!user) {
    return new Response(
      '가입되어 있지 않은 이메일 입니다.',
      { status: 401 },
    );
  }

  if (
    user &&
    (await bcrypt.compare(body.password, user.password!))
  ) {
    const { password, emailVerified, ...userWithoutPass } =
      user;

    const accessToken = signJwtAccessToken(userWithoutPass);
    const result = {
      ...userWithoutPass,
      accessToken,
    };
    return new Response(JSON.stringify(result));
  }
}
