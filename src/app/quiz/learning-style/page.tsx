"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Quiz questions to determine learning style
const questions = [
  {
    id: 1,
    question: "How does your child prefer to learn new information?",
    options: [
      { value: "visual", label: "By seeing pictures, diagrams, or videos" },
      { value: "auditory", label: "By listening to explanations or discussions" },
      { value: "kinesthetic", label: "By doing hands-on activities or experiments" },
      { value: "reading", label: "By reading books or written instructions" }
    ]
  },
  {
    id: 2,
    question: "When trying to remember something, what does your child do?",
    options: [
      { value: "visual", label: "Visualize it in their mind" },
      { value: "auditory", label: "Repeat it out loud or talk through it" },
      { value: "kinesthetic", label: "Act it out or use physical gestures" },
      { value: "reading", label: "Write it down or make notes" }
    ]
  },
  {
    id: 3,
    question: "What activities does your child enjoy most?",
    options: [
      { value: "visual", label: "Drawing, watching videos, or looking at pictures" },
      { value: "auditory", label: "Listening to music, talking, or singing" },
      { value: "kinesthetic", label: "Sports, dancing, or building things" },
      { value: "reading", label: "Reading books or writing stories" }
    ]
  },
  {
    id: 4,
    question: "How does your child typically explain things to others?",
    options: [
      { value: "visual", label: "Shows pictures or draws diagrams" },
      { value: "auditory", label: "Explains verbally with detailed descriptions" },
      { value: "kinesthetic", label: "Uses gestures or demonstrates physically" },
      { value: "reading", label: "Writes it down or refers to written material" }
    ]
  },
  {
    id: 5,
    question: "When your child is bored, what do they typically do?",
    options: [
      { value: "visual", label: "Doodle, watch videos, or look at pictures" },
      { value: "auditory", label: "Talk to someone or listen to music" },
      { value: "kinesthetic", label: "Move around, play with objects, or exercise" },
      { value: "reading", label: "Read a book or write something" }
    ]
  }
]

// Learning style descriptions
const learningStyleDescriptions = {
  visual: "Visual learners learn best by seeing. They prefer pictures, diagrams, and spatial understanding.",
  auditory: "Auditory learners learn best by hearing. They prefer discussions, verbal instructions, and sound.",
  kinesthetic: "Kinesthetic learners learn best by doing. They prefer hands-on activities and physical movement.",
  reading: "Reading/Writing learners learn best through text. They prefer reading books and taking notes."
}

export default function LearningStyleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [learningStyle, setLearningStyle] = useState("")
  const router = useRouter()

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    // Count occurrences of each learning style in answers
    const counts: Record<string, number> = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0
    }

    Object.values(answers).forEach(style => {
      if (style in counts) {
        counts[style]++
      }
    })

    // Find the learning style with the highest count
    let maxCount = 0
    let dominantStyle = ""

    Object.entries(counts).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count
        dominantStyle = style
      }
    })

    setLearningStyle(dominantStyle)
    setShowResults(true)
  }

  const handleSaveAndReturn = () => {
    // Save the learning style to localStorage
    const studentData = localStorage.getItem("studentData")
    if (studentData) {
      const data = JSON.parse(studentData)
      data.learningStyle = learningStyle
      localStorage.setItem("studentData", JSON.stringify(data))
    }
    
    // Return to register page
    router.push("/register")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-lime-100 shadow-md">
          <CardHeader className="border-b border-lime-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <CardTitle>Learning Style Quiz</CardTitle>
            </div>
            <CardDescription>
              {showResults 
                ? "Here are your child's learning style results" 
                : "Answer these questions to discover your child's learning style"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {!showResults ? (
              <div className="space-y-6">
                <div className="text-sm text-gray-500 mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                
                <h3 className="text-lg font-medium mb-4">
                  {questions[currentQuestion].question}
                </h3>
                
                <RadioGroup 
                  value={answers[questions[currentQuestion].id] || ""}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                      <RadioGroupItem 
                        value={option.value} 
                        id={`option-${option.value}`}
                        className="text-lime-500"
                      />
                      <Label 
                        htmlFor={`option-${option.value}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-lime-50 p-6 rounded-lg border border-lime-100">
                  <h3 className="text-xl font-medium text-lime-700 mb-2">
                    Your child is primarily a {learningStyle.charAt(0).toUpperCase() + learningStyle.slice(1)} Learner
                  </h3>
                  <p className="text-gray-700">
                    {learningStyleDescriptions[learningStyle as keyof typeof learningStyleDescriptions]}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-md font-medium text-blue-700 mb-2">What this means for your child's learning:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {learningStyle === "visual" && (
                      <>
                        <li>Use diagrams, charts, and pictures when teaching</li>
                        <li>Highlight important information with colors</li>
                        <li>Use videos and visual demonstrations</li>
                        <li>Create mind maps for organizing information</li>
                      </>
                    )}
                    {learningStyle === "auditory" && (
                      <>
                        <li>Encourage discussions and verbal explanations</li>
                        <li>Use audio recordings and verbal instructions</li>
                        <li>Read aloud and use rhymes or songs</li>
                        <li>Allow them to talk through problems</li>
                      </>
                    )}
                    {learningStyle === "kinesthetic" && (
                      <>
                        <li>Incorporate hands-on activities and experiments</li>
                        <li>Take frequent breaks for physical movement</li>
                        <li>Use manipulatives and physical objects</li>
                        <li>Allow them to act out concepts</li>
                      </>
                    )}
                    {learningStyle === "reading" && (
                      <>
                        <li>Provide written instructions and reading materials</li>
                        <li>Encourage note-taking and journaling</li>
                        <li>Use lists and written outlines</li>
                        <li>Have them rewrite information in their own words</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t border-lime-50 pt-4">
            {!showResults ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="border-lime-200 hover:bg-lime-50"
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="bg-lime-500 hover:bg-lime-600 text-white"
                >
                  {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleSaveAndReturn}
                className="w-full bg-lime-500 hover:bg-lime-600 text-white"
              >
                Save and Return to Registration
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
