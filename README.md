# PrepSync

**Real-time technical interview simulation platform.**  
AI interviewer. Live peer interviews. Collaborative coding. Structured feedback.  
Track interview readiness like a performance metric — not a guess.

PrepSync replicates the **pressure, structure, and feedback loop of real software engineering interviews** inside a single integrated system.

This is NOT:

- A LeetCode clone  
- A video calling tool  
- A chatbot wrapper  
- A Discord-style community  

This is **interview preparation infrastructure.**

---

## Problem

Students preparing for placements use fragmented tools:

- Coding practice platforms → no communication training  
- Video calls → no shared coding environment  
- Whiteboards → no evaluation system  
- Chat groups → no structured practice  
- Mock interviews → no measurable progress tracking  

There is no closed feedback loop.

PrepSync solves this by integrating:

- Practice  
- Collaboration  
- Community  
- Analytics  

into one real-time platform.

---

## Core Features

### AI Interview Simulation

A structured mock interview environment where AI:

- Asks domain-calibrated technical questions  
- Generates contextual follow-ups  
- Evaluates performance across multiple dimensions  
- Produces detailed evaluation reports  
- Updates readiness metrics  

Evaluation dimensions:

- Correctness  
- Approach quality  
- Time & space efficiency  
- Communication clarity  
- Problem decomposition  
- Edge case handling  

---

### Peer Interview Rooms

Live 1-on-1 mock interview system with:

- WebRTC video + audio  
- Collaborative Monaco code editor  
- Real-time whiteboard  
- Execution sandbox  
- Session chat + file sharing  
- Post-session peer rating  

---

### Collaborative Code Editor

Real-time CRDT-based collaborative editing.

Features:

- Monaco editor  
- Yjs synchronization  
- Cursor awareness  
- Multi-language execution  
- Inline output console  
- Conflict-free offline recovery  

---

### Performance Intelligence Dashboard

Tracks measurable interview readiness:

- Overall readiness score  
- Domain-wise readiness  
- Weakness radar chart  
- Session history  
- Peer percentile ranking  
- Practice streaks  
- Weekly goals tracking  

---

### Domain Study Communities

Purpose-driven technical groups:

- DSA  
- System Design  
- Backend  
- Conceptual CS  
- Behavioural  

Includes:

- Persistent study lounges  
- Group video calls  
- Real-time chat  
- Polls  
- File sharing  

---

### Structured Feedback Pipeline

Every session generates:

- AI evaluation report  
- Session summary  
- Improvement suggestions  
- Recommended next topics  

This creates a **continuous improvement loop.**

---

## System Architecture

### Client

- React + TypeScript
- Zustand state management
- TanStack Query
- Tailwind CSS
- Monaco Editor
- Fabric.js
- D3.js

### Backend

- Node.js + Express
- MongoDB Atlas
- Upstash Redis
- Socket.io realtime layer

### AI Pipeline

- Groq Llama-3.3-70B (production)
- Ollama (local development)
- Structured evaluation schema

### Realtime Systems

- WebRTC (1-on-1 video)
- LiveKit Cloud (group video SFU)
- Yjs CRDT editor sync
- Redis pub/sub event bus

### Execution Sandbox

- Judge0 CE
- Docker isolation
- Network disabled
- Resource-limited runtime

---

## Key Engineering Decisions

### Dual Video Architecture

| Use Case | Technology | Reason |
|--------|-----------|-------|
| 1-on-1 video | Native WebRTC | Zero server cost |
| Group calls | LiveKit SFU | Mesh fails at scale |

---

### CRDT Editor

Uses Yjs to ensure:

- Conflict-free collaboration
- Offline resilience
- Operational sync model
- Distributed editing guarantees

---

### Structured AI Evaluation

Not a chatbot system.

Implements:

- Rubric-embedded prompts  
- Typed response schema  
- Async evaluation pipeline  
- Session context ingestion  

---

### Secure Execution Environment

Code execution isolated via:

- Docker containers  
- Seccomp profiles  
- Memory & CPU caps  
- No network access  

---

## Performance Targets

| Metric | Target |
|-------|--------|
| Editor sync latency | < 200ms |
| AI evaluation report | < 10s |
| Dashboard load | < 2s |
| API response p95 | < 300ms |
| Code execution | < 6s |

---

## Security

- JWT access tokens (short-lived)
- httpOnly refresh tokens
- OAuth2 Google login
- bcrypt password hashing
- Rate limiting on auth routes
- Execution sandbox isolation
- CSP + HTTPS enforced

---

## Why PrepSync is a Strong Engineering Project

PrepSync demonstrates production-grade engineering across:

- Distributed realtime systems
- WebRTC networking
- CRDT data structures
- AI evaluation pipeline design
- Secure sandbox execution
- OAuth implementation
- Event-driven architecture
- Performance analytics design

This is **not a CRUD application.**

It reflects real system design tradeoffs found in:

- Developer collaboration tools
- Interview infrastructure platforms
- Realtime SaaS products
- AI-assisted evaluation systems

---

## Development Philosophy

- Depth over feature count  
- Real systems over demos  
- Measurable progress over vanity metrics  
- Production architecture over tutorials  

---

## Project Status

Active development — student-led system engineering project.

---

## License

MIT
