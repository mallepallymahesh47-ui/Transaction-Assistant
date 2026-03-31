# Transaction Assistant
#### AI-powered transaction assistant that lets you query your payment history in plain English

### Managing personal finances today means scrolling through long lists of transactions, manually searching for specific payments, and struggling to recall details. Traditional payment apps offer filters and search bars, but they require the user to already know what they're looking for — and they return raw data, not answers.

### Transaction Assistant solves this by layering a natural language AI assistant on top of a standard transaction dashboard. Instead of filtering and scrolling, users simply ask questions in plain English — and get precise, context-aware answers instantly.

## Features

- **AI Chatbot**: Floating chatbot assistant powered by RAG technology for natural language queries about transactions
- **Real-time Queries**: Powered by RAG (Retrieval-Augmented Generation) for accurate answers
- **Transaction Dashboard**: View balance, transaction history, and filter by status/type

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- CSS with custom properties for theming

### Backend
- FastAPI (Python)
- LangChain for RAG pipeline
- HuggingFace embeddings
- Groq LLM (Llama 3.3)
- FAISS vector database
- CORS enabled for frontend integration

## Installation

### Prerequisites
- Node.js 18+
- Python 3.8+
- Groq API key (for LLM)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 2-Paybot
   ```

2. **Backend Setup**
   ```bash
   # Install Python dependencies
   pip install fastapi uvicorn langchain-huggingface langchain-groq python-dotenv

   # Set up environment variables
   # Create .env file in root directory
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

3. **Frontend Setup**
   ```bash
   # Install Node dependencies
   npm install

   # Optional: Set API URL
   echo "VITE_PAYBOT_API_URL=http://localhost:8000" > .env
   ```

## Usage

### Start the Application

1. **Start Backend**
   ```bash
   uvicorn Bot.rag:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend** (in new terminal)
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Click the chat icon to ask questions about transactions

### Example Queries
- "Show me failed transactions"
- "How much did I spend on groceries?"
- "What is the status of transaction ID 1234?"

### How It Works
1. **Data Processing**: Transaction data from `src/data/transactions.json` is loaded and converted into searchable documents
2. **Vector Embeddings**: Each transaction is converted into vector embeddings using HuggingFace's sentence-transformers
3. **Similarity Search**: When you ask a question, the system finds the most relevant transactions using FAISS vector database
4. **AI Response**: The Groq LLM (Llama 3.3) generates natural language responses based on the retrieved context


### Technical Details
- **Model**: Llama 3.3 70B via Groq API
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Vector Store**: FAISS with MMR (Maximal Marginal Relevance) search
- **Temperature**: 0 (deterministic responses)
- **Search Results**: Top 20 similar transactions retrieved per query

## Project Structure

```
Transaction Assistant/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── data/          # Static data (transactions.json)
│   └── utils/         # Helper functions
├── Bot/
│   └──rag.py         # FastAPI backend with RAG
├── public/            # Static assets
├── package.json       # Frontend dependencies
├── pyproject.toml     # Python project config
└── README.md          # This file


---

## 📱 Mock Data

The app includes **104 realistic transactions** with:
- Indian names
- Indian brands (Swiggy, Zomato, Flipkart, etc.)
- INR amounts (₹119 to ₹15,000)
- UPI IDs (rajesh.k@okicici, swiggy@axisbank, etc.)
- Payment methods: UPI, Bank, Wallet
- Statuses: Success, Failed, Pending
- Notes: "Rent March 2026", "Lunch order", "Mobile recharge", etc.
