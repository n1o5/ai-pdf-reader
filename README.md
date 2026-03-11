# AI PDF Reader

A local RAG (Retrieval-Augmented Generation) app that lets you upload PDFs and chat with them. Runs entirely on your machine using Ollama — no data sent to external servers.

## How it works

1. Upload a PDF
2. The backend chunks the PDF and generates embeddings using `nomic-embed-text`
3. Embeddings are stored in a local ChromaDB vector database
4. When you ask a question, relevant chunks are retrieved and passed to `mistral` to generate an answer with source citations

## Stack

- **Frontend** — React + Vite + Tailwind CSS
- **Backend** — Python + Flask
- **Embeddings** — Ollama (`nomic-embed-text`)
- **LLM** — Ollama (`mistral`)
- **Vector DB** — ChromaDB

## Prerequisites

- [Python 3.10+](https://www.python.org/)
- [Node.js](https://nodejs.org/)
- [Ollama](https://ollama.com/) installed and running

## Setup

### 1. Pull Ollama models

```bash
ollama pull mistral
ollama pull nomic-embed-text
```

### 2. Install Python dependencies

```bash
pip install flask flask-cors langchain langchain-ollama langchain-chroma langchain-community pypdf chromadb
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the app

You need two terminals open at the same time.

**Terminal 1 — Flask backend** (from the project root):
```bash
python3 api.py
```

**Terminal 2 — Vite frontend** (from the `frontend/` folder):
```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Drop a PDF into the sidebar or click to browse
2. Wait for indexing to complete (may take a moment depending on PDF size)
3. Ask questions about your document in the chat input
4. The AI will answer based on the document contents and cite the source chunks

## Resetting the database

To clear all indexed documents:
```bash
python3 main.py --reset
```

## Notes

- All processing is local — your PDFs never leave your machine
- Indexing and response speed depends on your hardware (Apple Silicon runs faster via Ollama's GPU support)
- Only PDF files are supported for upload
