# SiteScope AI 🔍

SiteScope AI is a premium Business Intelligence (BI) tool that transforms website data into structured, actionable insights using AI-driven crawling and analysis.

## 🚀 Features

- **Deep Crawling**: Crawls up to 10 sub-pages of any website using Firecrawl.
- **Strategic Analysis**: Generates deep SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
- **SEO Insights**: Extracts meta tags and identifies primary keywords.
- **Brand Analysis**: Analyzes brand voice, tone, and uniqueness factors.
- **Modern Dashboard**: A beautiful glassmorphism UI built with React, Tailwind CSS, and Framer Motion.

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python API framework.
- **Firecrawl**: Advanced web crawler for LLMs.
- **Google Gemini 2.5 Flash**: State-of-the-art LLM for business analysis.
- **LangChain & Pydantic**: For structured data extraction and AI orchestration.

### Frontend
- **React (Vite)**: Frontend framework.
- **Tailwind CSS**: Modern styling.
- **Framer Motion**: Smooth animations.
- **Lucide React**: Premium iconography.

## 📦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Firecrawl API Key](https://firecrawl.dev)
- [Gemini API Key](https://aistudio.google.com)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/raswanthappu/SiteScope-AI.git
   cd SiteScope-AI
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   FIRECRAWL_API_KEY=your_key
   GEMINI_API_KEY=your_key
   PORT=8000
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend**:
   ```bash
   cd backend
   source venv/bin/activate
   python main.py
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📄 License
MIT
