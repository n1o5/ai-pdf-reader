import { useState, useRef } from "react"

export default function Sidebar({ onUpload, uploadedFiles, isUploading }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) return
    onUpload(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-mark">◈</div>
        <span className="logo-text">PDF READER</span>
      </div>

      <div
        className={`drop-zone ${dragOver ? "drag-active" : ""} ${isUploading ? "uploading" : ""}`}
        onClick={() => !isUploading && fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {isUploading ? (
          <div className="upload-spinner">
            <div className="spinner" />
            <span>Indexing…</span>
          </div>
        ) : (
          <>
            <div className="upload-icon">⊕</div>
            <p className="upload-label">Drop PDF here</p>
            <p className="upload-sub">or click to browse</p>
          </>
        )}
      </div>

      <div className="file-list">
        {uploadedFiles.length > 0 && (
          <p className="file-list-label">Indexed documents</p>
        )}
        {uploadedFiles.map((name, i) => (
          <div key={i} className="file-item">
            <span className="file-icon">▣</span>
            <span className="file-name">{name}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
