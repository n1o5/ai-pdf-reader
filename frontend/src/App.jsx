import { useState } from "react"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        setUploadedFiles((prev) => [...prev, file.name])
      } else {
        alert(data.error || "Upload failed")
      }
    } catch {
      alert("Could not reach the server.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        onUpload={handleUpload}
        uploadedFiles={uploadedFiles}
        isUploading={isUploading}
      />
      <ChatWindow hasDocuments={uploadedFiles.length > 0} />
    </div>
  )
}
