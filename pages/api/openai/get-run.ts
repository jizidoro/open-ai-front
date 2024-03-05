import { NextApiRequest, NextApiResponse } from 'next';
// Assuming fetch is available in your environment, or you've added a polyfill for it.
// import fetch from 'node-fetch'; or use any HTTP client library you prefer.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ run: any } | { error: string }> // Adjust the type of 'run' based on your expected response structure
) {
  try {
    const threadID = req.query.threadID as string;
    const runID = req.query.runID as string;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    if (!runID) {
      return res.status(400).json({ error: 'Run ID is required' });
    }

    const apiUrl = `https://localhost:44304/api/v1/run-open-ai/get-run/${threadID}/run/${runID}`; // Replace with the actual API URL
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary headers here, such as Authorization for Bearer tokens
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const run = await response.json();

    return res.status(200).json(run); // Adjust according to the actual response structure
  } catch (error) {
    console.error('Error retrieving run:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
