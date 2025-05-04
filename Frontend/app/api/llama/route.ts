import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  let reqData;
  let analysisType = 'unknown';
  
  try {
    // Safely parse the request body
    try {
      reqData = await req.json();
      analysisType = reqData.analysisType || 'unknown';
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse request body',
        status: 'error'
      }, { status: 400 });
    }
    
    const { messages, analysisType: type } = reqData;
    analysisType = type; // Update the analysis type
    
    // Validate that messages is an array and not empty
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('No messages provided for Llama API');
      return NextResponse.json({ 
        error: 'No messages provided for analysis',
        status: 'error'
      }, { status: 400 });
    }
    
    // Check if we have actual data to analyze in the last user message
    const lastUserMessage = messages.findLast(m => m.role === 'user');
    if (!lastUserMessage || !lastUserMessage.content) {
      console.error('No user data found in messages');
      return NextResponse.json({
        error: 'No user data found in messages',
        status: 'error'
      }, { status: 400 });
    }
    
    // Initialize the client
    console.log(`Initializing Llama API for ${analysisType} analysis...`);
    const client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_LLAMA_API_KEY || "LLM|1671322013583157|rLNuBsns7aO149BRL62uO5OLcIk",
      baseURL: 'https://api.llama.com/compat/v1/',
    });

    let content;
    let apiUsed = false;
    
    try {
      console.log('Calling Llama API...');
      const response = await client.chat.completions.create({
        model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages,
        temperature: 0.2, // Lower temperature for more deterministic responses
        max_tokens: 1500, // Ensure we get complete responses
      });
      
      content = response.choices[0].message.content;
      apiUsed = true;
      console.log('Successfully received response from Llama API');
      
      // Validate that the content is proper JSON
      try {
        // Just validate but don't modify the content
        JSON.parse(content);
        console.log('Llama API returned valid JSON');
      } catch (jsonError) {
        console.error('Llama returned invalid JSON:', jsonError);
        // Still use the calculated values, but let client handle the response
        // This allows the client to decide whether to use the malformed response
        apiUsed = false;
        throw jsonError;
      }
    } catch (apiError) {
      console.error('Failed to call Llama API:', apiError);
      apiUsed = false;
      // Let the client know we couldn't use the API
      return NextResponse.json({ 
        error: 'Failed to get valid response from Llama API',
        api_used: false,
        status: 'error',
        // Don't include content so the client will use its own calculation
      }, { status: 500 });
    }
    
    // Return the API response, indicating whether it's from the API or a fallback
    return NextResponse.json({ 
      content,
      analysisType,
      api_used: apiUsed,
      status: 'success'
    });
  } catch (error) {
    console.error('Unhandled error in API route:', error);
    return NextResponse.json({ 
      error: 'An error occurred during API processing',
      message: error.message || 'Unknown error',
      api_used: false,
      status: 'error',
      // Don't include content so the client will use its own calculation
    }, { status: 500 });
  }
} 