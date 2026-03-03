# CreatorZero

CreatorZero is a scalable, AI-powered SaaS platform designed for long-term product evolution. It empowers content creators by automating script generation, trend analysis, and content scheduling with a focus on psychological engagement and viral potential.

## 🚀 Mission & Principles

- **Think Long-Term**: Built for scale and future-ready evolution.
- **Clean Abstractions**: Strict layer isolation and modular service architecture.
- **AI-First**: Deep integration of structured AI output for high-quality content generation.
- **Growth & Retention**: Every feature is designed to serve user growth and engagement.

## 🏗️ Project Structure

```text
createZero/
├── frontend/          # React + Vite + TypeScript (UI layer)
├── backend/           # Fastify + TypeScript (API layer)
├── GEMINI.md          # Core architecture and behavior guidelines
└── README.md          # Project documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Query (TanStack)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: Fastify
- **Language**: TypeScript
- **Validation**: Zod
- **Security**: Fastify Helmet & CORS
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn
- Supabase account (for database and auth)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd createZero
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your Supabase credentials
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update .env with your Supabase credentials
   npm run dev
   ```

## 📐 Architecture Guidelines

The project follows a strict architectural discipline as outlined in [GEMINI.md](file:///Users/mohitranjan11082/Documents/createZero/GEMINI.md):

- **Backend**: Routes → Controllers → Services → AI Layer → DB Layer.
- **Scalability**: Designed for 100k+ users and heavy AI usage.
- **Security**: Row Level Security (RLS) is enforced for all user data.
- **Outputs**: AI must always return structured JSON (hooks, body, CTA, viral score).

## 📄 License

This project is licensed under the ISC License.
