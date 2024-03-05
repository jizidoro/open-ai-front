import { Thread } from '@/types/openai';
import { NextApiRequest, NextApiResponse } from 'next';
// If you're using node-fetch, you would import it here. For simplicity, assuming fetch is available.
// import fetch from 'node-fetch'; 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<{ thread: Thread } | { error: string }>
) {
  try {
    const apiUrl = 'https://localhost:44304/api/v1/thread-open-ai/create-thread'; // Replace with the actual API URL
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary headers here, such as Authorization for Bearer tokens
      },
      body: JSON.stringify({
        // Any necessary body content as per the API documentation
      }),
    });

    if (!response.ok) {
      // Handling responses that are not 2xx
      throw new Error(`API call failed with HTTP status ${response.status}`);
    }

    const thread = await response.json();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ thread });
  } catch (error) {
    console.error('Error creating thread:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
