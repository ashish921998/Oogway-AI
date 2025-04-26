# OogwayAI

<p align="center">
  <img src="/public/oogway-logo.svg" alt="Oogway AI Logo" width="120" height="120" />
</p>

<h3 align="center">Personalized Learning for Every Child</h3>

<p align="center">
  OogwayAI addresses the challenge of one-size-fits-all education by creating personalized learning experiences that adapt to each child's unique learning style, needs, and abilities.
</p>

## Overview

OogwayAI is an AI-powered educational platform designed to transform how children learn. By identifying each child's unique learning style and adapting content accordingly, OogwayAI creates a personalized educational experience that enhances engagement, comprehension, and retention.

## Key Features

- **Learning Style Assessment**: Interactive quiz to identify a child's dominant learning style (Visual, Auditory, Kinesthetic, or Reading/Writing)
- **Personalized AI Tutor**: Intelligent chatbot that adapts its teaching approach based on the child's learning style
- **Visual Learning Support**: Automatic generation of relevant images for visual learners using DALL-E
- **Adaptive Learning Paths**: Content that adjusts to match each child's unique learning needs
- **Real-time Feedback**: Immediate, constructive guidance to reinforce positive learning behaviors
- **Progress Analytics**: Detailed insights into the child's learning journey
- **Responsive Design**: Beautiful, modern UI that works across devices

## Learning Styles Supported

- **Visual Learners**: Content enhanced with diagrams, images, and visual aids
- **Auditory Learners**: Focus on verbal explanations and discussions
- **Kinesthetic Learners**: Emphasis on hands-on activities and interactive learning
- **Reading/Writing Learners**: Text-based content with opportunities for note-taking

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components

- **Form Handling**:
  - React Hook Form
  - Zod for validation

- **AI Integration**:
  - OpenAI GPT-3.5 Turbo for conversational AI
  - DALL-E 3 for image generation

- **State Management**:
  - React useState/useEffect
  - localStorage for client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/oogway-ai.git
   cd oogway-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Registration**: Start by registering a student profile with name, age, and other basic information
2. **Learning Style Quiz**: Complete the learning style assessment to identify the child's preferred learning method
3. **Dashboard**: Access the personalized dashboard with AI tutor and learning resources
4. **AI Interaction**: Engage with the AI tutor by asking questions or requesting explanations on various topics

## Project Structure

```
oogway-ai/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   └── chat/        # AI chat endpoint
│   │   ├── dashboard/       # Dashboard page
│   │   ├── quiz/            # Learning style assessment
│   │   ├── register/        # Student registration
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable UI components
│   └── lib/                 # Utility functions and hooks
├── .env.local               # Environment variables (create this file)
└── package.json             # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the AI models
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the React framework
