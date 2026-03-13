# NetConnect Call Center

AI-powered call center application for an internet service provider. Features real-time voice-to-text transcription, GPT-driven customer support responses following predefined scripts, and a full admin panel for tracking calls.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy (async) + SQLite
- **AI**: OpenAI GPT-4o-mini for intent analysis and script-based responses
- **Voice**: Web Speech API (browser-native STT) + Speech Synthesis (TTS)
- **Real-time**: WebSocket for live call communication

## Features

- **10 customer support scripts** covering: no internet, slow speed, router setup, WiFi issues, billing, plan changes, outages, new connections, cancellation, device issues
- **Admin dashboard** with call stats, active/completed/unresolved counts
- **Call tracking** with phone number, status, duration, full transcript
- **Unresolved query detection** — messages the AI can't confidently answer are flagged for human review
- **Voice interface** — speak into the mic, AI responds following the support script
- **Text fallback** — type messages manually if speech recognition isn't available

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- OpenAI API key

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env with your API key
echo "OPENAI_API_KEY=your-key-here" > .env
echo "DATABASE_URL=sqlite+aiosqlite:///./call_center.db" >> .env

# Start the server (auto-seeds the 10 support scripts on first run)
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 in your browser.

## Usage

1. **Dashboard** — View call center overview stats
2. **New Call** — Enter a phone number, click Call, then speak or type
3. **Calls** — Browse all calls, view full transcripts
4. **Unresolved** — Review queries the AI couldn't match to a script
5. **Scripts** — View and edit the 10 support scripts

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/calls/` | List all calls |
| POST | `/api/calls/` | Start a new call |
| GET | `/api/calls/dashboard` | Dashboard statistics |
| GET | `/api/calls/unresolved` | Calls with unresolved messages |
| GET | `/api/calls/{id}` | Call detail with transcript |
| PATCH | `/api/calls/{id}/end` | End a call |
| GET | `/api/scripts/` | List support scripts |
| PUT | `/api/scripts/{id}` | Update a script |
| WS | `/ws/call/{id}` | Real-time call WebSocket |
