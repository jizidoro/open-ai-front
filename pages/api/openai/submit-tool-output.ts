import { NextApiRequest, NextApiResponse } from 'next';
// Assuming fetch is available in your environment, or you've added a polyfill for it.
// import fetch from 'node-fetch'; or use any HTTP client library you prefer.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ run: any } | { error: string }> // Adjust the run type based on your API response
) {
  try {
    const { threadID, runID, toolOutputs } = req.body;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    if (!runID) {
      return res.status(400).json({ error: 'Run ID is required' });
    }

    if (!toolOutputs) {
      return res.status(400).json({ error: 'Tool outputs are required' });
    }

    const apiUrl = `https://localhost:44304/api/v1/threads/${threadID}/runs/${runID}/submit`; // Replace with the actual API URL
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary headers, such as Authorization
      },
      body: JSON.stringify({
        tool_outputs: toolOutputs,
        // Include any other necessary body parameters according to your API documentation
      }),
    });

    if (!response.ok) {
      // If the response is not 2xx, throw an error
      throw new Error(`API call failed with status ${response.status}`);
    }

    const run = await response.json();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(run); // Adjust according to the actual response structure
  } catch (error) {
    console.error('The API encountered an error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
