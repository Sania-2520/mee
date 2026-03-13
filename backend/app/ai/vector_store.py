import faiss
import numpy as np
import logging
import google.generativeai as genai
from typing import List
from app.config.settings import settings

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

class VectorStore:
    # Gemini text-embedding-004 outputs 768 dimensions
    def __init__(self, dimension: int = 768):
        # Using L2 distance FAISS index
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(self.dimension)
        # In-memory mapping of doc_id to text strings
        self.documents: List[str] = []
        
    def _get_embedding(self, text: str) -> np.ndarray:
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document"
            )
            embedding = result['embedding']
            return np.array(embedding, dtype='float32')
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return np.zeros(self.dimension, dtype='float32')

    def add_documents(self, texts: List[str]):
        """Embed and add a list of text chunks to the FAISS index."""
        if not texts:
            return
            
        embeddings = []
        for text in texts:
            emb = self._get_embedding(text)
            embeddings.append(emb)
            self.documents.append(text)
            
        if embeddings:
            embeddings_array = np.vstack(embeddings)
            self.index.add(embeddings_array)

    def search(self, query: str, k: int = 3) -> List[str]:
        """Search the FAISS index for the top k most similar documents."""
        if self.index.ntotal == 0:
            return []
            
        try:
            # For queries, task_type can be retrieval_query
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=query,
                task_type="retrieval_query"
            )
            query_embedding = np.array(result['embedding'], dtype='float32').reshape(1, -1)
            distances, indices = self.index.search(query_embedding, k)
            
            results = []
            for idx in indices[0]:
                if idx != -1 and idx < len(self.documents):
                    results.append(self.documents[idx])
                    
            return results
        except Exception as e:
            logger.error(f"Error searching embeddings: {e}")
            return []

# Expose a global instance for simple in-memory retrieval during runtime
vector_store = VectorStore()
