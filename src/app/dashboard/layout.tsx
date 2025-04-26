"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is registered
    const studentData = localStorage.getItem("studentData")
    if (!studentData) {
      router.push("/register")
    }
  }, [router])

  return <>{children}</>
}
