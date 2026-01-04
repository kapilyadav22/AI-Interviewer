<div align="center">

# AI-Powered Mock Interview Platform

### Practice real interviews. Get real feedback. Level up faster.

An **AI-driven mock interview platform** that simulates real-world technical and behavioral interviews using **Generative AI, real-time collaboration, and live coding tools**.

<br/>

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-fast-purple)
![Tailwind](https://img.shields.io/badge/TailwindCSS-modern-teal)
![WebRTC](https://img.shields.io/badge/WebRTC-real--time-green)
![AI](https://img.shields.io/badge/AI-Generative-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

</div>

---

## What is this?

This platform recreates **real interview environments** — technical, behavioral, and system design — by combining:

- AI-driven interviewers
- Live coding & debugging
- Collaborative system design
- Peer-to-peer mock interviews
- Career preparation tools

Built for **engineers preparing for product-based companies**.

---

## Key Features

### AI Mock Interviews

- Simulated **video & audio interviews**
- Real-time AI feedback on:
  - Answer quality
  - Communication clarity
  - Tone & delivery
- Supports **technical & behavioral** rounds

---

### System Design Whiteboard

- Real-time collaborative whiteboard
- Powered by **tldraw**
- Ideal for **HLD / LLD interviews**
- Multi-participant architecture discussions

---

### Code Compiler & Bug Hunt

- Monaco Editor (VS Code-like experience)
- Supports:
  - DSA challenges
  - Debugging rounds
  - Bug-hunt problems
- In-browser execution with instant feedback

---

### Peer-to-Peer Interviews

- Live **video & audio** mock interviews
- Built with **WebRTC (PeerJS)**
- Low-latency, real-time communication
- Interviewer & candidate roles

---

### Career Toolkit

- Resume Optimization
- Salary Negotiation Simulator
- Pitch Coach (elevator pitch practice)

---

### Learning Resources

- Flashcards for quick revision
- Company-specific sprint prep
- Structured learning roadmaps

---

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Framer Motion

### AI & Intelligence

- Google Gemini API
- OpenAI API

### Backend & Auth

- Supabase (Auth + Database)

### Real-Time & Media

- PeerJS (WebRTC)
- React Webcam
- React Media Recorder

---

## Architecture Highlights

- Feature-based modular architecture
- Clear separation of:
  - Core logic
  - Feature modules
  - Shared utilities
- Scalable routing for **20+ feature screens**
- Easy onboarding for contributors

---

## Performance Optimizations

- Lazy loading for heavy routes
- Aggressive code splitting
- Optimized media streams
- Minimal bundle size with Vite

---

## Project Structure

```bash
src/
├── core/
├── features/
│ ├── ai-interview/
│ ├── code-editor/
│ ├── whiteboard/
│ ├── p2p-interview/
│ └── career-tools/
├── shared/
├── services/
├── routes/
└── main.tsx
```
