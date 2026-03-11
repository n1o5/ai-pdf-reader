export default function Message({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl rounded-lg px-4 py-3 text-sm ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gray-800 text-gray-100"
        }`}
      >
        {message.content}

        {message.sources?.length > 0 && (
          <div className="mt-2 text-xs text-gray-400">
            Sources: {message.sources.join(", ")}
          </div>
        )}
      </div>
    </div>
  )
}
