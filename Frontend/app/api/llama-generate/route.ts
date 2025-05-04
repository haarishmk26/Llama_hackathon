import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { default: OpenAI } = await import('openai');

  const client = new OpenAI({
    apiKey: process.env.LLAMA_API_KEY,
    baseURL: 'https://api.llama.com/compat/v1/',
  });

  // Example prompt, you can customize this as needed
  const messages = [
    { role: 'user', content: 'Generate a project summary page for Mobile App Onboarding Flow.' },
  ];

  try {
    const response = await client.chat.completions.create({
      model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
      messages,
    });
    const content = response.choices[0].message.content;
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 