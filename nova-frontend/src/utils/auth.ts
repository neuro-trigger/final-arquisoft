import { jwtDecode } from 'jwt-decode';

const JWT_SECRET = 'Thunderbolts*';

export interface DecodedToken {
  email: string;
  exp: number;
  httpOnly: boolean;
  iat: number;
  lastLog: string;
  phone: string;
  secure: boolean;
  type: string;
  userID: string;
  username: string;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function getTokenFromCookie(): string | null {
  console.log('All cookies:', document.cookie);
  
  const cookies = document.cookie.split(';');
  console.log('Split cookies:', cookies);
  
  const accessTokenCookie = cookies.find(cookie => {
    const trimmed = cookie.trim();
    console.log('Checking cookie:', trimmed);
    return trimmed.startsWith('accessToken=');
  });
  
  if (accessTokenCookie) {
    console.log('Found accessToken cookie:', accessTokenCookie);
    const token = accessTokenCookie.split('=')[1].trim();
    console.log('Extracted token:', token ? 'Token exists' : 'Token is empty');
    return token;
  }
  
  console.log('No accessToken cookie found');
  return null;
} 