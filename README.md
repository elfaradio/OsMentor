# 🎓 OsMentor AI

Welcome to **OsMentor AI**, your personal Operating Systems tutoring chatbot! 
OsMentor AI is powered by a robust Retrieval-Augmented Generation (RAG) backend to provide accurate, textbook-grounded answers to your OS questions.

---

## 🌟 Features

- **Interactive Chat Interface**: Ask complex OS questions and get detailed, easy-to-understand answers.
- **Source Citations**: Every answer includes citations to the original textbook pages so you can read further.
- **Custom Knowledge Base**: Ingest your own PDF textbooks and materials to build a personalized tutor.
- **Fast & Responsive UI**: Built with modern web technologies for a seamless learning experience.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Mermaid (for dynamic diagrams)

**Backend:**
- Python 3.12 & FastAPI
- LangChain & Sentence Transformers
- ChromaDB (Vector Database)
- PyMuPDF (for PDF processing)
- Gemini API / Groq / Ollama support

---

## 🚀 Getting Started

Follow these steps to get OsMentor AI up and running on your local machine.

### Prerequisites
- Python 3.12+
- Node.js & npm

### 1. Backend Setup

Open a terminal and navigate to the project root:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Set up environment variables
cp .env.example .env
# Open .env and add your GOOGLE_API_KEY (or other provider keys)
```

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend

# Install frontend dependencies
npm install
```

---

## 📖 Usage

### Running the Application

You'll need to run both the backend API and the frontend development server.

**Start the Backend:**
```bash
# Ensure your virtual environment is active
uvicorn backend.app.main:app --reload
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will typically be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

### Building the Knowledge Base

Before the chatbot can answer questions, you need to feed it some data!

1. **Add PDFs**: Place your source PDF textbooks inside the `data/raw/` directory.
2. **Run the Pipeline**: Execute the full indexing pipeline to extract text, chunk it, and load it into the database:
   ```bash
   python -m rag_pipeline.index
   ```
   *Note: If you want to run steps individually, you can use `python -m rag_pipeline.ingest` followed by `python -m rag_pipeline.chunking`.*

---

## 📁 Project Structure

- `backend/` - FastAPI backend application and API routes
- `frontend/` - React UI application
- `rag_pipeline/` - Scripts for PDF ingestion, chunking, and embedding
- `vector_db/` - ChromaDB vector database manager and storage
- `data/` - Storage for raw PDFs and processed JSON data
- `tests/` - Backend unit and integration tests
