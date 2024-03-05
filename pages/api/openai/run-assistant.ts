import { NextApiRequest, NextApiResponse } from 'next';
// Assuming fetch is available in your environment, or you've added a polyfill for it.
// import fetch from 'node-fetch'; or use any HTTP client library you prefer.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ run: any } | { error: string }> // Adjust the run type based on your API response
) {
  try {
    const { threadID, assistantID } = req.body;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    const apiUrl = `https://localhost:44304/api/v1/run-open-ai/create-run/${threadID}`; // Corrected URL
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary headers, such as Authorization
      },
      body: JSON.stringify({
        assistantId: assistantID || process.env.OPENAI_ASSISTANT_ID,
        // Ensure the body parameters match the API documentation/expectation
      }),
    });

    if (!response.ok) {
      // If the response is not 2xx, throw an error
      throw new Error(`API call failed with status ${response.status}`);
    }

    const run = await response.json();

    return res.status(200).json(run); // Adjust according to the actual response structure
  } catch (error) {
    console.error('The API encountered an error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
