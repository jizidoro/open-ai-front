import { Message } from '@/types/openai';
import { NextApiRequest, NextApiResponse } from 'next';
// Assuming fetch is available in your environment, or you've added a polyfill for it.
// import fetch from 'node-fetch'; or use any HTTP client library you prefer.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const initAssistantMessage = {
  id: 'init',
  role: 'assistant',
  content: [{ type: 'text', text: { value: 'Demo' } }],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Message[] // Adjust 'any' to match your content structure
    | { error: string; }
  >
) {
  const threadID = req.query.threadID as string;

  if (!threadID) {
    return res.status(400).json({ error: 'Thread ID is required' });
  }

  try {
    const apiUrl = `https://localhost:44304/api/v1/message-open-ai/${threadID}/messages`; // Replace with your actual API URL
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary headers, such as authorization tokens
      },
      // No body is needed for a GET request
    });

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const threadMessages = await response.json();

    // Assuming your API returns a similar structure, adjust the mapping as needed
    const messages = threadMessages.data.map(({ id, role, content }: Message) => ({
      id,
      role,
      content,
    }));

    return res.status(200).json([initAssistantMessage, ...messages]);
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
