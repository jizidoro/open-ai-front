import { Message } from '@/types/openai';
import { NextApiRequest, NextApiResponse } from 'next';
// Assuming fetch is available in your environment, or you've added a polyfill for it.
// import fetch from 'node-fetch'; or use any HTTP client library you prefer.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | { error: string }>
) {
  try {
    const { threadID, content, files } = req.body;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const apiUrl = `https://localhost:44304/api/v1/message-open-ai/create-message/${threadID}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers like Authorization here
      },
      body: JSON.stringify({
        threadID: threadID,
        role: 'user', // Assuming this is a constant in your use case
        content: content,
        file_ids: files, // Ensure your API expects this format
      }),
    });

    if (!response.ok) {
      // If the response is not 2xx, throw an error
      throw new Error(`API call failed with status ${response.status}`);
    }

    const message = await response.json();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      id: message.id, // Adjust according to the actual response structure
      role: message.role, // Adjust according to the actual response structure
      content: message.content, // Adjust according to the actual response structure
    });
  } catch (error) {
    console.error('Error creating message:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
