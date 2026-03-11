import argparse
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from get_embedding_function import get_embedding_function

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
You are a factual document assistant.
If the answer is not present in the context, say "I don't know".

Use quotes from the context when possible.
Cite page IDs.

{context}

---

Answer the question based on the above context: {question}
"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()

    result = query_rag(args.query_text)

    print("Response:")
    print(result["answer"])
    print("\nSources:")
    for src in result["sources"]:
        print("-", src)

def query_rag(query_text: str):
    embedding_function = get_embedding_function()
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_function
    )

    results = db.similarity_search_with_score(query_text, k=10)
    
    results = [(doc, score) for doc, score in results if score < 1.5]

    if len(results) == 0:
        return {
            "answer": "No relevant information found in the documents you've provided.",
            "sources": []
        }

    context_text = "\n\n---\n\n".join(
        [doc.page_content for doc, _score in results]
    )

    prompt = ChatPromptTemplate.from_template(
        PROMPT_TEMPLATE
    ).format(
        context=context_text,
        question=query_text
    )

    model = OllamaLLM(model="mistral")
    response_text = model.invoke(prompt)

    sources = [
        doc.metadata.get("id", "unknown")
        for doc, _score in results
    ]

    return {
        "answer": response_text,
        "sources": sources
    }


if __name__ == "__main__":
    main()