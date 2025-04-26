import { type NextRequest } from 'next/server'
import OpenAI from 'openai'

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { messages, studentData } = await req.json()

    // Create the system message based on student data
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI tutor. Your student is ${studentData.age} years old and prefers ${studentData.learningStyle} learning style. Tailor your responses accordingly to be age-appropriate and align with their learning preferences.`
    }

    // Create chat completion via OpenAI SDK
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [systemMessage, ...messages.map((message: any) => ({
        role: message.role,
        content: message.content
      }))]
    })

    // Create a TransformStream for text encoding
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ''
          controller.enqueue(encoder.encode(content))
        }
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Error processing your request', { status: 500 })
  }
}