from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from app.rag.vectorStore import get_vectorstore
from app.config import settings

TEMPLATE = """Answer the question based only on the following context:
{context}

Question: {question}
"""

def build_rag_chain():
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3},
    )

    prompt = PromptTemplate.from_template(TEMPLATE)

    llm = ChatGoogleGenerativeAI(
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0,
        model=settings.LLM_MODEL,
    )

    retrieve = {
        "context": retriever | (lambda docs: "\n\n".join(d.page_content for d in docs)),
        "question": RunnablePassthrough(),
    }
   

    return retrieve | prompt | llm | StrOutputParser()

# Build once at import time — reused across requests
rag_chain = build_rag_chain()