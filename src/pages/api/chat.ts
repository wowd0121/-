import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: 'No messages provided' });
  }
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });
    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return res.status(500).json({ error: err });
    }
    const data = await openaiRes.json();
    const result = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(500).json({ error: 'OpenAI API 호출 실패' });
  }
} 