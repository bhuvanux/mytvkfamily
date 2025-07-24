// lib/openaiClient.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // store securely in .env
});

export async function generateCaption(prompt, platform = 'Instagram') {
  const res = await openai.chat.completions.create({
    model: 'gpt-4', // or 'gpt-3.5-turbo' for faster response
    messages: [
      {
        role: 'system',
        content: `You are a creative social media strategist specializing in writing high-converting captions for ${platform}. Return motivational content in 3 parts: CAPTION, HASHTAGS, and CTA.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return res.choices[0].message.content;
}
