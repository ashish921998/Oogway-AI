"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ImageData = {
  index: number
  description: string
  url: string
  error?: boolean
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: ImageData[]
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [studentData, setStudentData] = useState<any>(null)

  useEffect(() => {
    // Load student data
    const data = localStorage.getItem("studentData")
    if (data) {
      setStudentData(JSON.parse(data))
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          studentData
        })
      })

      if (!response.ok) throw new Error(response.statusText)
      
      // Create a new assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      }
      setMessages(prev => [...prev, assistantMessage])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

      let imageDataBuffer = ''
      let collectingImageData = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        
        // Check if we're starting to receive image data
        if (text.includes('__IMAGE_DATA_START__')) {
          collectingImageData = true
          const parts = text.split('__IMAGE_DATA_START__')
          
          // Add the text content before the marker
          if (parts[0]) {
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1]
              if (lastMessage.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + parts[0] }
                ]
              }
              return prev
            })
          }
          
          // Start collecting image data
          if (parts[1]) {
            imageDataBuffer += parts[1]
          }
          continue
        }
        
        // Check if we're ending image data collection
        if (collectingImageData && text.includes('__IMAGE_DATA_END__')) {
          const parts = text.split('__IMAGE_DATA_END__')
          imageDataBuffer += parts[0]
          
          try {
            // Process the complete image data JSON
            const cleanedData = imageDataBuffer.replace('__IMAGE_DATA_END__', '').trim()
            const imageData = JSON.parse(cleanedData) as ImageData[]
            
            // Update the message with images
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1]
              if (lastMessage.role === 'assistant') {
                // Replace image placeholders with a more user-friendly format
                let updatedContent = lastMessage.content
                imageData.forEach(img => {
                  const placeholder = `[IMAGE: ${img.description}]`
                  updatedContent = updatedContent.replace(placeholder, `[Image: ${img.description}]`)
                })
                
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: updatedContent, images: imageData }
                ]
              }
              return prev
            })
          } catch (error) {
            console.error('Error parsing image data:', error, imageDataBuffer)
          }
          
          // Reset image data collection
          collectingImageData = false
          imageDataBuffer = ''
          
          // Add any text after the end marker
          if (parts[1]) {
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1]
              if (lastMessage.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + parts[1] }
                ]
              }
              return prev
            })
          }
          continue
        }
        
        // If we're collecting image data, add to buffer
        if (collectingImageData) {
          imageDataBuffer += text
          continue
        }
        
        // Normal text processing
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + text }
            ]
          }
          return prev
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to render message content with images
  const renderMessageContent = (message: Message) => {
    if (!message.images || message.images.length === 0) {
      return <div>{message.content || (isLoading && message.role === 'assistant' ? '...' : '')}</div>
    }
    
    // For messages with images, we'll render the content and images
    return (
      <div className="space-y-4">
        <div>{message.content}</div>
        <div className="grid grid-cols-1 gap-4">
          {message.images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              {!img.error ? (
                <img 
                  src={img.url} 
                  alt={img.description} 
                  className="rounded-lg max-w-full h-auto shadow-md" 
                />
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                  Image generation failed
                </div>
              )}
              <p className="text-sm text-gray-500 italic">{img.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Profile */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 bg-lime-100">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback className="bg-lime-100 text-lime-700">{studentData?.name?.[0] || "ST"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Welcome, {studentData?.name || "Student"}!</CardTitle>
                  <CardDescription>Student Dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Learning Style</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {studentData?.learningStyle || "Not specified"} Learner
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Progress</h3>
                  <div className="h-2 bg-gray-100 rounded-full mt-2">
                    <div className="h-full w-1/3 bg-lime-500 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Interface */}
          <Card className="md:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>AI Learning Assistant</CardTitle>
              <CardDescription>
                Ask any questions about your lessons or get help with your studies
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div 
                  ref={chatContainerRef}
                  className="h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <Avatar className={`h-8 w-8 ${message.role === "assistant" ? "bg-lime-100" : "bg-lime-500"}`}>
                        <AvatarFallback className={message.role === "assistant" ? "text-lime-700" : "text-white"}>
                          {message.role === "assistant" ? "AI" : "Me"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "assistant"
                            ? "bg-white border"
                            : "bg-lime-500 text-white"
                        }`}
                      >
                        {renderMessageContent(message)}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    placeholder="Type your message..."
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="border-lime-200 focus-visible:ring-lime-500/20"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-lime-500 hover:bg-lime-600 text-white"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
