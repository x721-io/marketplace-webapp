import { clearAuthCookies } from '@/services/cookies';

export async function POST(/*request: Request*/) {
  clearAuthCookies();

  return Response.json(
    { message: 'OK' },
    {
      status: 200,
    },
  );
}
