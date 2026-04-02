from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from pathlib import Path
from dotenv import load_dotenv

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_community.document_loaders import JSONLoader
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_retrieval_chain

# Load ENV 

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
os.environ["LANGCHAIN_API_KEY"]=os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"]="true"
os.environ["LANGCHAIN_PROJECT"]=os.getenv("LANGCHAIN_PROJECT")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found")

# FastAPI

app = FastAPI(title="Transaction Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models 

LLM = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=GROQ_API_KEY,
    temperature=0
)

embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load Docs 
def format_metadata(record: dict, metadata: dict) -> dict:
    metadata.update(record)
    return metadata

def load_docs():
    loader = JSONLoader(
        file_path=Path("src/data/transactions.json"),
        jq_schema=".[]",
        text_content=False,
        metadata_func=format_metadata
    )

    docs = loader.load()

    for doc in docs:
        data = json.loads(doc.page_content)

        direction = "Sent to" if data.get("type") == "debit" else "Received from"

        doc.page_content = (
            f"Transaction ID : {data.get('id')}\n"
            f"{direction} {data.get('name')} ({data.get('upiId')})\n"
            f"Amount : ₹{data.get('amount')}\n"
            f"Status : {data.get('status')}\n"
            f"Date : {data.get('date')}"
        )

    return docs

# Build Chain 

docs = load_docs()
vectorstore = FAISS.from_documents(docs, embedding)

retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 20}
)

SYSTEM_PROMPT = """
You are PayBot, a transaction assistant.
make sure to keep the answers short ans clear, represent the long answers in Points style
Answer ONLY from context.

<context>
{context}
</context>
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "{input}")
])

document_chain = create_stuff_documents_chain(LLM, prompt)
chain = create_retrieval_chain(retriever, document_chain)

# Request Schema 

class QueryRequest(BaseModel):
    query: str

# API Endpoint 

@app.post("/chat")
def chat_api(request: QueryRequest):
    try:
        response = chain.invoke({"input": request.query})
        return {
            "status": "success",
            "answer": response["answer"]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Health Check 

@app.get("/")
def home():
    return {"message": "PayBot API is running 🚀"}
