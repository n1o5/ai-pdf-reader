import { useState, useRef, useEffect } from "react"

function Message({ role, text, sources }) {
  return (
    <div className={`message message-${role}`}>
      <div className="message-label">{role === "user" ? "YOU" : "AI"}</div>
      <div className="message-bubble">
        <p className="message-text">{text}</p>
        {sources && sources.length > 0 && (
          <div className="sources">
            <p className="sources-label">Sources</p>
            {sources.map((s, i) => (
              <span key={i} className="source-chip">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatWindow({ hasDocuments }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer, sources: data.sources },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error: could not reach the server." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <main className="chat-window">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            {hasDocuments
              ? "Ask anything about your documents."
              : "Upload a PDF in the sidebar to get started."}
          </div>
        )}
        {messages.map((m, i) => (
          <Message key={i} role={m.role} text={m.text} sources={m.sources} />
        ))}
        {loading && (
          <div className="message message-ai">
            <div className="message-label">AI</div>
            <div className="message-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          className={`send-btn ${loading || !input.trim() ? "disabled" : ""}`}
          onClick={send}
        >
          ↑
        </button>
      </div>
    </main>
  )
}
