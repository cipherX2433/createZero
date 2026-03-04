# CreatorZero

CreatorZero is a premium, AI-powered SaaS platform designed for content creators. It automates script generation, image creation, and provides a dynamic post editor to maximize engagement and viral potential.

## 🚀 Key Features

- **AI Script Engine**: Generates high-retention scripts using pattern-interrupt psychology.
- **AI Image Generation**: Built-in integration with Hugging Face (Playground v2) for high-quality visuals.
- **Dynamic Post Canvas**: A real-time editor to preview and customize social media posts with modern layouts.
- **Scalable Architecture**: Built for 100k+ users with strict layer isolation and modular services.

## 🏗️ Project Structure

```text
createZero/
├── frontend/          # React + Vite + TypeScript + Tailwind (UI Layer)
├── backend/           # Fastify + TypeScript + Zod (API Layer)
├── GEMINI.md          # Core architecture and senior engineering guidelines
└── README.md          # Project overview and setup
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS + Radix UI
- **State**: TanStack Query (React Query)
- **Animation**: Framer Motion
- **Components**: Lucide Icons

### Backend
- **Framework**: Fastify
- **AI Layer**: Hugging Face Inference API + Gemini Prompts
- **Validation**: Zod (strict typing)
- **Database & Auth**: Supabase (PostgreSQL with RLS)

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Supabase Account
- Hugging Face API Token (for image generation)

### Installation

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd createZero
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env # Add SUPABASE_URL, SUPABASE_KEY, HF_TOKEN
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env # Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
   npm run dev
   ```

## 📐 Architecture Principles

The project adheres to strict guidelines defined in `GEMINI.md`:

- **Isolation**: Routes → Controllers → Services → AI Layer → DB Layer.
- **Security**: Row Level Security (RLS) is non-negotiable.
- **Output**: All AI outputs are structured JSON with engagement scores.

## 📄 License

ISC License.
