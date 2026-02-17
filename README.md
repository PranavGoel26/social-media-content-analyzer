# Social Media Content Analyzer

## Project Overview

Social Media Content Analyzer is a full-stack web application that analyzes social media posts and suggests engagement improvements using a locally running Large Language Model (LLM) via Ollama.  

The application allows users to:
- Paste text content for analysis
- Upload PDF documents
- Upload image files (with OCR support)
- Extract text from documents
- Receive AI-generated engagement suggestions

The system performs PDF parsing, OCR-based text extraction for images, and sends the extracted content to a backend API. The backend communicates with a local LLM instance (TinyLlama via Ollama) to generate structured engagement feedback.

The project was built with production-quality structure, basic error handling, loading states, and clean UI components. It is designed to be lightweight, modular, and easily deployable.

---

## Architecture Overview

The application follows a clean client-server architecture:

Frontend (React + Vite + Tailwind)
- Handles UI rendering
- Manages file uploads (PDF / Image)
- Displays loading states
- Sends extracted text to backend
- Displays AI response directly

Backend (Node.js + Express)
- Handles API endpoints
- Manages file uploads
- Extracts text from PDFs (pdf-parse)
- Extracts text from images (Tesseract OCR)
- Sends extracted text to Ollama LLM API
- Returns AI response to frontend

LLM Layer (Ollama - TinyLlama)
- Runs locally or via Docker
- Generates engagement suggestions

Data Flow:
User → Frontend → Backend → Ollama → Backend → Frontend → UI

---

## Folder Structure

social-media-content-analyzer/
│
├── backend/
│ ├── uploads/ # Uploaded files storage
│ ├── server.js # Express server
│ ├── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Navbar.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Home.jsx
│ │ │ └── Analyze.jsx
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ ├── package.json
│
└── README.md


---

## Features

- Text-based post analysis
- PDF text extraction
- OCR-based image text extraction
- Drag-and-drop file upload
- Loading indicators
- Error handling
- Clean light-themed UI
- Docker-compatible Ollama setup

---

## Technologies Used

Frontend:
- React
- Vite
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- Multer
- pdf-parse
- Tesseract.js

AI:
- Ollama
- TinyLlama model

Deployment:
- Vercel (Frontend)
- Render (Backend)
- Docker (Ollama)

---

## How to Run Locally

### Backend


---

## Features

- Text-based post analysis
- PDF text extraction
- OCR-based image text extraction
- Drag-and-drop file upload
- Loading indicators
- Error handling
- Clean light-themed UI
- Docker-compatible Ollama setup

---

## Technologies Used

Frontend:
- React
- Vite
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- Multer
- pdf-parse
- Tesseract.js

AI:
- Ollama
- TinyLlama model

Deployment:
- Vercel (Frontend)
- Render (Backend)
- Docker (Ollama)

---

## How to Run Locally

### Backend

cd backend
npm install
node server.js



### Frontend


cd frontend
npm install
npm run dev


Ensure Ollama is running:


---

## Deployment

Frontend: Deploy on Vercel  
Backend: Deploy on Render  
LLM: Deploy via Docker container with Ollama  

---

## Author

PRANAV GOEL
