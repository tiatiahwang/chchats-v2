import { db } from '@/lib/db';
import * as bcrypt from 'bcrypt';

interface RequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json();

  const user = await db.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    // TODO: new Response
  }

  if (
    user &&
    (await bcrypt.compare(body.password, user.password!))
  ) {
    const { password, ...userWithoutPassword } = user;
    return new Response(
      JSON.stringify(userWithoutPassword),
    );
  }
}
