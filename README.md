# CreatorZero

CreatorZero is a premium, general-purpose AI image generation platform. It allows users to transform any text description into high-quality visuals with granular control over resolution and aspect ratio.

## 🚀 Key Features

- **General-Purpose AI Generation**: Create any image—from cyberpunk cities to abstract landscapes—using raw natural language prompts.
- **Configurable Aspect Ratios**: Support for 10 distinct shapes including `1:1`, `16:9`, `9:16`, `21:9`, `4:3`, `3:2`, and more.
- **Resolution Control**: Toggle between `720P` and `1080P` for optimized generations.
- **Creation Workspace**:
  - **Minimalist Dashboard**: Focused bottom-docked prompt bar with glassmorphism aesthetics.
  - **Dynamic Gallery**: Visual grid of past creations organized by timestamp.
  - **Detailed Image Hub**: Fullscreen inspection with action tools (Download, Share, Save, Delete, Dislike) and comprehensive metadata (Model, Resolution, Ratio).
- **Pro Navigation**: Icon-based sidebar for quick access to Home, Creations, and Profile.

## 🏗️ Project Structure

```text
createZero/
├── frontend/          # React + Vite + TypeScript (UI Layer with modern glassmorphism)
├── backend/           # Fastify + TypeScript + Zod (High-performance API Layer)
├── GEMINI.md          # Core architecture and engineering principles
└── README.md          # Project overview and setup
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite) + TypeScript
- **Icons**: Lucide React
- **Styling**: Vanilla CSS for precision UI + Custom Design System
- **State**: React Location State for seamless prompt propagation

### Backend
- **Framework**: Fastify (Node.js)
- **AI Layer**: Hugging Face Inference API (Stable Diffusion XL 1.0)
- **Resolution Engine**: Dynamic pixel mapping for aspect-ratio-accurate generations
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Supabase Account
- Hugging Face API Token

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
   cp .env.example .env # Add VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
   npm run dev
   ```

## 📐 Architecture Principles

The project follows a strict **Architectural Mental Model**:
- **Layer Isolation**: Routes → Controllers → Services → AI Layer → DB Layer.
- **Deterministic Structure**: Standardized API responses and strict Zod validation.
- **Cost Awareness**: Optimized for AI token efficiency and usage logging.

## 📄 License

ISC License.
