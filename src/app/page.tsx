import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-lime-500 to-lime-600 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('/globe.svg')] bg-repeat"></div>
        <div className="max-w-6xl mx-auto px-4 py-24 sm:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Personalized Learning for Every Child
              </h1>
              <p className="text-xl opacity-90 max-w-lg">
                OogwayAI addresses the challenge of one-size-fits-all education by creating 
                personalized learning experiences that adapt to each child's unique needs and abilities.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 text-lg px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="#learn-more">
                  <Button size="lg" variant="outline" className="border-white text-black hover:text-lime-600 text-lg px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-lime-300 rounded-xl"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-lime-400 rounded-full"></div>
                <div className="relative h-full w-full bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 shadow-inner">
                  <Image 
                    src="/globe.svg" 
                    alt="Learning illustration" 
                    width={250} 
                    height={250} 
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Problem Statement Section */}
      <section id="learn-more" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Challenges Young Learners Face
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional education often fails to address the unique needs of each child
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">One-Size-Fits-All Approach</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Standard curricula don't account for different learning styles and paces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Children learn at different rates and in different ways, yet traditional classrooms 
                  often teach everyone the same way, leaving many students behind or unchallenged.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Lack of Engagement</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Disengagement leads to reduced learning outcomes and frustration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  When material isn't presented in a way that resonates with a child's interests and 
                  learning style, they quickly lose interest and motivation to learn.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Limited Personalization</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Individual strengths and weaknesses aren't adequately addressed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Every child has unique strengths, weaknesses, and knowledge gaps. Without personalized 
                  attention, these individual needs often go unaddressed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Advantages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Power of AI-Tailored Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How OogwayAI transforms education through personalization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="w-14 h-14 rounded-lg bg-lime-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Adaptive Learning Paths</h3>
              <p className="text-gray-700">
                Our AI analyzes your child's learning patterns and automatically adjusts content 
                difficulty and style to match their unique needs.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="w-14 h-14 rounded-lg bg-lime-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Feedback</h3>
              <p className="text-gray-700">
                Immediate, constructive feedback helps children understand concepts better and 
                reinforces positive learning behaviors.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="w-14 h-14 rounded-lg bg-lime-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Personalized Content</h3>
              <p className="text-gray-700">
                Learning materials tailored to each child's interests make education more 
                engaging and relevant to their world.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="w-14 h-14 rounded-lg bg-lime-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Progress Analytics</h3>
              <p className="text-gray-700">
                Detailed insights into your child's learning journey help identify strengths 
                and areas needing additional support.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="w-14 h-14 rounded-lg bg-lime-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Engaging Gamification</h3>
              <p className="text-gray-700">
                Learning becomes fun through game-like elements that motivate children to 
                continue their educational journey.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="w-14 h-14 rounded-lg bg-lime-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Parent Involvement</h3>
              <p className="text-gray-700">
                Tools for parents to stay connected with their child's education and 
                provide meaningful support at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-lime-500 to-lime-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Child's Learning Experience?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have discovered the power of 
            personalized education with OogwayAI.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100 text-lg px-10 py-6">
              Start Your Child's Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Parents Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from families using OogwayAI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "My son struggled with math for years. With OogwayAI, he's not only improved his grades but actually enjoys learning now. The personalized approach has made all the difference."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-600 font-semibold mr-3">
                    SM
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-500">Parent of 9-year-old</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "As a busy parent, I appreciate how OogwayAI keeps me informed about my daughter's progress. The detailed reports help me understand exactly where she needs support."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-600 font-semibold mr-3">
                    JT
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">James T.</p>
                    <p className="text-sm text-gray-500">Parent of 7-year-old</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "My daughter has ADHD and traditional schooling was a challenge. OogwayAI's adaptive approach keeps her engaged and focused. I've seen remarkable improvement in just a few months."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-600 font-semibold mr-3">
                    RL
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rebecca L.</p>
                    <p className="text-sm text-gray-500">Parent of 11-year-old</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
