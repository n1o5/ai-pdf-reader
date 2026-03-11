import { useState } from "react"

export default function InputBar({ onSend }) {
  const [text, setText] = useState("")

  function send() {
    if (!text.trim()) return
    onSend(text)
    setText("")
  }

  return (
    <div className="p-4 border-t border-white/10 flex gap-2">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && send()}
        placeholder="Ask about your documents..."
        className="flex-1 bg-panel rounded px-4 py-2 outline-none"
      />
      <button
        onClick={send}
        className="bg-accent px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  )
}
