"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, BookOpenIcon, MessageSquareIcon, TrophyIcon, UserIcon, HomeIcon, LogOutIcon, BellIcon, CheckCircleIcon, CircleIcon } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState<string>("dashboard")

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <img src="/oogway-logo.svg" alt="Oogway AI Logo" className="h-8 w-8" />
            <h2 className="text-xl font-bold text-lime-600">Oogway AI</h2>
          </div>
        </div>
        <div className="py-4">
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10 bg-lime-100">
                <AvatarImage src="/avatar-placeholder.png" />
                <AvatarFallback className="bg-lime-100 text-lime-700">{studentData?.name?.[0] || "ST"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{studentData?.name || "Student"}</p>
                <p className="text-xs text-gray-500 capitalize">{studentData?.learningStyle || "Visual"} Learner</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("dashboard")} 
              className={`flex items-center gap-3 px-4 py-3 w-full text-left ${
                activeTab === "dashboard" 
                  ? "text-lime-600 bg-lime-50 border-r-4 border-lime-500" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-lime-600 transition-colors"
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab("schedule")} 
              className={`flex items-center gap-3 px-4 py-3 w-full text-left ${
                activeTab === "schedule" 
                  ? "text-lime-600 bg-lime-50 border-r-4 border-lime-500" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-lime-600 transition-colors"
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Schedule</span>
            </button>
            <button 
              onClick={() => setActiveTab("chatbot")} 
              className={`flex items-center gap-3 px-4 py-3 w-full text-left ${
                activeTab === "chatbot" 
                  ? "text-lime-600 bg-lime-50 border-r-4 border-lime-500" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-lime-600 transition-colors"
              }`}
            >
              <MessageSquareIcon className="h-5 w-5" />
              <span>AI Chatbot</span>
            </button>
            <button 
              onClick={() => setActiveTab("courses")} 
              className={`flex items-center gap-3 px-4 py-3 w-full text-left ${
                activeTab === "courses" 
                  ? "text-lime-600 bg-lime-50 border-r-4 border-lime-500" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-lime-600 transition-colors"
              }`}
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>Courses</span>
            </button>
            <button 
              onClick={() => setActiveTab("achievements")} 
              className={`flex items-center gap-3 px-4 py-3 w-full text-left ${
                activeTab === "achievements" 
                  ? "text-lime-600 bg-lime-50 border-r-4 border-lime-500" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-lime-600 transition-colors"
              }`}
            >
              <TrophyIcon className="h-5 w-5" />
              <span>Achievements</span>
            </button>
            <button 
              onClick={() => setActiveTab("profile")} 
              className={`flex items-center gap-3 px-4 py-3 w-full text-left ${
                activeTab === "profile" 
                  ? "text-lime-600 bg-lime-50 border-r-4 border-lime-500" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-lime-600 transition-colors"
              }`}
            >
              <UserIcon className="h-5 w-5" />
              <span>Profile</span>
            </button>
          </nav>
          <div className="px-4 mt-8 pt-4 border-t">
            <a href="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors rounded-md">
              <LogOutIcon className="h-5 w-5" />
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {activeTab === "dashboard" && (
            <>
              {/* Welcome Card */}
              <Card className="mb-6 bg-lime-50 border-none">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-2">Good afternoon, {studentData?.name || "Student"}!</h2>
                  <p className="text-gray-600">Ready to continue your learning journey? Here's what's happening with your courses today.</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Learning Progress */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Your progress across all courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Overall Progress</span>
                          <span>62%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-full w-[62%] bg-lime-600 rounded-full" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Mathematics</span>
                          <span>65%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-full w-[65%] bg-lime-600 rounded-full" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Science</span>
                          <span>42%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-full w-[42%] bg-lime-600 rounded-full" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>English</span>
                          <span>78%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-full w-[78%] bg-lime-600 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Goals */}
                <Card className="md:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Learning Goals</CardTitle>
                      <CardDescription>Your daily learning objectives</CardDescription>
                    </div>
                    <div className="text-sm text-gray-500">2/4</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-500 line-through">
                        <CheckCircleIcon className="h-5 w-5 text-lime-600" />
                        <span>Complete Algebra module</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 line-through">
                        <CheckCircleIcon className="h-5 w-5 text-lime-600" />
                        <span>Practice problem-solving for 30 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleIcon className="h-5 w-5 text-gray-300" />
                        <span>Review Science notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleIcon className="h-5 w-5 text-gray-300" />
                        <span>Take English quiz</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Announcements */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>Latest updates and news</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <BellIcon className="h-5 w-5 text-lime-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">New AI Tutor Feature Released</h4>
                            <p className="text-sm text-gray-600">Try our new AI Tutor that can answer your questions in real-time!</p>
                            <p className="text-xs text-gray-500">Today</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <BellIcon className="h-5 w-5 text-lime-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Upcoming Maintenance</h4>
                            <p className="text-sm text-gray-600">The platform will be down for maintenance on Sunday from 2-4 AM IST.</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <BellIcon className="h-5 w-5 text-lime-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">New Science Courses Added</h4>
                            <p className="text-sm text-gray-600">Check out our new courses on Biology and Chemistry!</p>
                            <p className="text-xs text-gray-500">1 week ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommended Courses */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>Courses tailored to your learning profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white h-32 rounded-md mb-3 flex items-center justify-center text-gray-300">
                        <span>Course Image</span>
                      </div>
                      <div className="bg-lime-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">98% Match</div>
                      <h3 className="font-medium">Advanced Algebra</h3>
                      <p className="text-sm text-gray-600">Master algebraic concepts</p>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white h-32 rounded-md mb-3 flex items-center justify-center text-gray-300">
                        <span>Course Image</span>
                      </div>
                      <div className="bg-lime-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">92% Match</div>
                      <h3 className="font-medium">Creative Writing</h3>
                      <p className="text-sm text-gray-600">Develop your storytelling skills</p>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white h-32 rounded-md mb-3 flex items-center justify-center text-gray-300">
                        <span>Course Image</span>
                      </div>
                      <div className="bg-lime-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">85% Match</div>
                      <h3 className="font-medium">Physics Fundamentals</h3>
                      <p className="text-sm text-gray-600">Learn the laws of physics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Lessons */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upcoming Lessons</CardTitle>
                  <CardDescription>Your scheduled learning sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-lime-100 p-2 rounded-md text-lime-600">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Quadratic Equations</h3>
                        <p className="text-sm text-gray-600">Advanced Algebra</p>
                        <p className="text-xs text-gray-500">Today at 2:00 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-lime-100 p-2 rounded-md text-lime-600">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Narrative Structure</h3>
                        <p className="text-sm text-gray-600">Creative Writing</p>
                        <p className="text-xs text-gray-500">Tomorrow at 10:30 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-lime-100 p-2 rounded-md text-lime-600">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Newton's Laws of Motion</h3>
                        <p className="text-sm text-gray-600">Physics Fundamentals</p>
                        <p className="text-xs text-gray-500">Wednesday at 3:15 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "schedule" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Schedule</CardTitle>
                <CardDescription>Upcoming classes and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Today</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="bg-lime-100 p-2 rounded-md text-lime-600">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">Quadratic Equations</h3>
                            <span className="text-sm text-lime-600">2:00 PM - 3:30 PM</span>
                          </div>
                          <p className="text-sm text-gray-600">Advanced Algebra</p>
                          <p className="text-sm text-gray-500 mt-2">Room: Virtual Classroom 3</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Tomorrow</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="bg-lime-100 p-2 rounded-md text-lime-600">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">Narrative Structure</h3>
                            <span className="text-sm text-lime-600">10:30 AM - 12:00 PM</span>
                          </div>
                          <p className="text-sm text-gray-600">Creative Writing</p>
                          <p className="text-sm text-gray-500 mt-2">Room: Virtual Classroom 1</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="bg-green-100 p-2 rounded-md text-green-500">
                          <TrophyIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">Mathematics Quiz</h3>
                            <span className="text-sm text-lime-600">2:00 PM - 3:00 PM</span>
                          </div>
                          <p className="text-sm text-gray-600">Assessment</p>
                          <p className="text-sm text-gray-500 mt-2">Room: Assessment Center</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "chatbot" && (
            <Card className="h-full">
              <CardHeader className="border-b border-gray-100">
                <CardTitle>AI Learning Assistant</CardTitle>
                <CardDescription>
                  Ask any questions about your lessons or get help with your studies
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[calc(100vh-12rem)]">
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                  >
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <MessageSquareIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">Welcome to AI Chatbot</h3>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">
                          Ask any questions about your courses, assignments, or learning concepts. I'm here to help!
                        </p>
                      </div>
                    )}
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
                  <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
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
          )}

          {activeTab === "courses" && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>Currently enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-lime-100 flex items-center justify-center">
                        <BookOpenIcon className="h-16 w-16 text-lime-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg">Advanced Algebra</h3>
                        <p className="text-sm text-gray-600 mb-3">Master algebraic concepts and equations</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs text-gray-500">Progress</span>
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full mt-1">
                              <div className="h-full w-[65%] bg-lime-600 rounded-full" />
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-lime-600 border-lime-200">
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-green-100 flex items-center justify-center">
                        <BookOpenIcon className="h-16 w-16 text-green-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg">Creative Writing</h3>
                        <p className="text-sm text-gray-600 mb-3">Develop your storytelling and narrative skills</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs text-gray-500">Progress</span>
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full mt-1">
                              <div className="h-full w-[78%] bg-green-500 rounded-full" />
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-green-500 border-green-200">
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-purple-100 flex items-center justify-center">
                        <BookOpenIcon className="h-16 w-16 text-purple-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg">Physics Fundamentals</h3>
                        <p className="text-sm text-gray-600 mb-3">Learn the laws of physics and mechanics</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs text-gray-500">Progress</span>
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full mt-1">
                              <div className="h-full w-[42%] bg-purple-500 rounded-full" />
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-purple-500 border-purple-200">
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Courses</CardTitle>
                  <CardDescription>Based on your learning profile and interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white h-32 rounded-md mb-3 flex items-center justify-center text-gray-300">
                        <span>Course Image</span>
                      </div>
                      <div className="bg-lime-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">98% Match</div>
                      <h3 className="font-medium">Calculus I</h3>
                      <p className="text-sm text-gray-600">Introduction to differential calculus</p>
                      <Button className="w-full mt-3 bg-lime-600 hover:bg-lime-700">Enroll Now</Button>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white h-32 rounded-md mb-3 flex items-center justify-center text-gray-300">
                        <span>Course Image</span>
                      </div>
                      <div className="bg-lime-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">95% Match</div>
                      <h3 className="font-medium">Poetry Workshop</h3>
                      <p className="text-sm text-gray-600">Express yourself through poetry</p>
                      <Button className="w-full mt-3 bg-lime-600 hover:bg-lime-700">Enroll Now</Button>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white h-32 rounded-md mb-3 flex items-center justify-center text-gray-300">
                        <span>Course Image</span>
                      </div>
                      <div className="bg-lime-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">90% Match</div>
                      <h3 className="font-medium">Chemistry Basics</h3>
                      <p className="text-sm text-gray-600">Introduction to chemical principles</p>
                      <Button className="w-full mt-3 bg-lime-600 hover:bg-lime-700">Enroll Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "achievements" && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Badges and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrophyIcon className="h-12 w-12 text-yellow-500" />
                      </div>
                      <h3 className="font-medium">Quick Learner</h3>
                      <p className="text-sm text-gray-600">Completed 5 lessons in one day</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrophyIcon className="h-12 w-12 text-lime-600" />
                      </div>
                      <h3 className="font-medium">Math Wizard</h3>
                      <p className="text-sm text-gray-600">Scored 100% on Algebra test</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrophyIcon className="h-12 w-12 text-green-500" />
                      </div>
                      <h3 className="font-medium">Consistent</h3>
                      <p className="text-sm text-gray-600">Logged in for 7 days in a row</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrophyIcon className="h-12 w-12 text-gray-300" />
                      </div>
                      <h3 className="font-medium text-gray-400">Locked</h3>
                      <p className="text-sm text-gray-400">Complete more courses to unlock</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Milestones</CardTitle>
                  <CardDescription>Your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Completed Algebra Basics</h3>
                        <p className="text-sm text-gray-600">You've mastered the fundamentals of algebra</p>
                        <p className="text-xs text-gray-500 mt-1">April 20, 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">First Story Published</h3>
                        <p className="text-sm text-gray-600">Your creative writing piece was featured in the student showcase</p>
                        <p className="text-xs text-gray-500 mt-1">April 15, 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Joined Oogway AI</h3>
                        <p className="text-sm text-gray-600">Started your personalized learning journey</p>
                        <p className="text-xs text-gray-500 mt-1">April 1, 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "profile" && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <Avatar className="h-32 w-32 mb-4 bg-lime-100">
                        <AvatarImage src="/avatar-placeholder.png" />
                        <AvatarFallback className="bg-lime-100 text-lime-700 text-4xl">{studentData?.name?.[0] || "ST"}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="w-full">Change Photo</Button>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Full Name</label>
                          <Input defaultValue={studentData?.name || "Student"} className="w-full" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Email</label>
                          <Input defaultValue="student@example.com" className="w-full" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Learning Style</label>
                          <Input defaultValue={studentData?.learningStyle || "Visual"} className="w-full" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Grade Level</label>
                          <Input defaultValue="11th Grade" className="w-full" />
                        </div>
                      </div>
                      <Button className="bg-lime-500 hover:bg-lime-600 mt-2">Save Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Preferences</CardTitle>
                  <CardDescription>Customize your learning experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Learning Style</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Based on your quiz results, you are a <span className="font-medium capitalize">{studentData?.learningStyle || "Visual"}</span> learner.
                        This means you learn best through {studentData?.learningStyle === 'visual' 
                          ? 'images, diagrams, and visual aids' 
                          : studentData?.learningStyle === 'auditory' 
                            ? 'listening and verbal instructions' 
                            : studentData?.learningStyle === 'reading/writing' 
                              ? 'reading and writing information' 
                              : 'hands-on activities and physical experiences'}.
                      </p>
                      <Button variant="outline" size="sm">Retake Learning Style Quiz</Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Notification Preferences</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Email Notifications</label>
                          <div className="w-12 h-6 bg-lime-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Assignment Reminders</label>
                          <div className="w-12 h-6 bg-lime-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Course Updates</label>
                          <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
