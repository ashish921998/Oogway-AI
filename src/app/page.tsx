import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to OogwayAI
          </h1>
          <p className="text-xl text-gray-600">
            Personalized learning experiences for your child's growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Learning</CardTitle>
              <CardDescription>
                Tailored education paths based on your child's unique learning style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI-powered platform adapts to how your child learns best, ensuring
                they get the most out of their educational journey.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expert Guidance</CardTitle>
              <CardDescription>
                Supported by experienced educators and cutting-edge AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Combine the best of human expertise with advanced AI technology
                for optimal learning outcomes.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
