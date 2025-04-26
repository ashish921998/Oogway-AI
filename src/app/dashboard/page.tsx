"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
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

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Profile */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback>{studentData?.name?.[0] || "ST"}</AvatarFallback>
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
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Interface */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>AI Learning Assistant</CardTitle>
              <CardDescription>
                Ask any questions about your lessons or get help with your studies
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.role === "assistant" ? "AI" : "Me"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "assistant"
                            ? "bg-white border"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content || (isLoading && message.role === 'assistant' ? '...' : '')}
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
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
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
