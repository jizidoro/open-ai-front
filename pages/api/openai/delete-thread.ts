import { NextApiRequest, NextApiResponse } from 'next';
// Assuming fetch is available in your environment, or you've added a polyfill for it.
// import fetch from 'node-fetch'; or use any HTTP client library you prefer.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string; } | { error: string }>
) {
  try {
    const { threadID } = req.body;

    if (!threadID) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    const apiUrl = `https://localhost:44304/api/v1/thread-open-ai/delete-thread/${threadID}`; // Replace with your actual API URL
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        // Add any necessary headers here, such as Authorization
        'Content-Type': 'application/json',
      },
      // If your API requires a body for DELETE, include it here. Most REST APIs do not.
    });

    if (!response.ok) {
      // If the response is not 2xx, throw an error
      throw new Error(`API call failed with status ${response.status}`);
    }

    // Adjust the response handling based on how your API indicates success
    const result = await response.json(); // Assuming the API returns a JSON response

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      message: 'Thread deleted successfully', // Customize based on your API's success response
    });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
