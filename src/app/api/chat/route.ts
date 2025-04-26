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
    const isVisualLearner = studentData.learningStyle === 'visual'

    // Create the system message based on student data
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI tutor. Your student is ${studentData.age} years old and prefers ${studentData.learningStyle} learning style. Tailor your responses accordingly to be age-appropriate and align with their learning preferences.${isVisualLearner ? ' For this visual learner, include image descriptions in your responses when relevant, enclosed in [IMAGE: brief description of what to visualize]. For example, if explaining photosynthesis, you might include [IMAGE: diagram showing sunlight being absorbed by plant leaves and converted to energy].' : ''}`
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

    // For visual learners, we'll process the response to generate images
    const stream = new ReadableStream({
      async start(controller) {
        let accumulatedContent = ''
        
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ''
          accumulatedContent += content
          
          // Stream the content as it comes
          controller.enqueue(encoder.encode(content))
        }
        
        // If visual learner and we have image placeholders, generate image URLs
        if (isVisualLearner) {
          // We'll send a special marker to indicate the end of the text response
          // The client will know to process any image requests after this
          const imageRequests = extractImageRequests(accumulatedContent)
          
          if (imageRequests.length > 0) {
            // Send a special delimiter to indicate image data is coming
            controller.enqueue(encoder.encode('\n\n__IMAGE_DATA_START__\n'))
            
            // Generate images in parallel
            const imagePromises = imageRequests.map(async (request, index) => {
              try {
                const imageUrl = await generateImage(request.description)
                return { index, description: request.description, url: imageUrl }
              } catch (error) {
                console.error('Image generation error:', error)
                return { index, description: request.description, error: true }
              }
            })
            
            const imageResults = await Promise.all(imagePromises)
            controller.enqueue(encoder.encode(JSON.stringify(imageResults)))
            
            // End image data marker
            controller.enqueue(encoder.encode('\n__IMAGE_DATA_END__'))
          }
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

// Helper function to extract image requests from content
function extractImageRequests(content: string) {
  const regex = /\[IMAGE: (.*?)\]/g
  const requests = []
  let match

  while ((match = regex.exec(content)) !== null) {
    requests.push({
      description: match[1],
      placeholder: match[0]
    })
  }

  return requests
}

// Helper function to generate an image using OpenAI's DALL-E
async function generateImage(description: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: description,
      n: 1,
      size: "1024x1024",
    })
    
    // Check if response.data exists and has at least one item
    if (response.data && response.data.length > 0 && response.data[0].url) {
      return response.data[0].url
    } else {
      throw new Error('No image URL returned from OpenAI')
    }
  } catch (error) {
    console.error('Error generating image:', error)
    throw error
  }
}