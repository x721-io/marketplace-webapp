import axios from 'axios';

import { APP_SETTINGS_URL } from '@/config/env';

export async function GET() {
  try {
    const response = await axios.get(APP_SETTINGS_URL);
    return Response.json(
      {
        data: response.data,
        message: 'Fetched Main App settings',
      },
      {
        status: 200,
      },
    );
  } catch (e: any) {
    return Response.json(
      { message: 'Failed to fetch app settings', error: e.message },
      {
        status: 400,
      },
    );
  }
}
