import jwt, { JwtPayload } from 'jsonwebtoken';

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: '1h',
};

const SECRET_KEY = process.env.JWT_SECRET;

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION,
) {
  const token = jwt.sign(payload, SECRET_KEY!, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log('verify token error: ', error);
    return null;
  }
}
