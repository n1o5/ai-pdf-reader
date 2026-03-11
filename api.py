from flask import Flask, request, jsonify
from flask_cors import CORS
from query_data import query_rag
import os
import subprocess

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

DATA_PATH = "data"

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    os.makedirs(DATA_PATH, exist_ok=True)
    save_path = os.path.join(DATA_PATH, file.filename)
    file.save(save_path)

    # Run the ingestion pipeline
    result = subprocess.run(
        ["python3", "main.py"],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        return jsonify({"error": "Ingestion failed", "details": result.stderr}), 500

    return jsonify({"message": f"'{file.filename}' uploaded and indexed successfully."})


@app.route("/chat", methods=["POST"])
def chat():
    question = request.json.get("message")
    if not question:
        return jsonify({"error": "No message provided"}), 400
    result = query_rag(question)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=False)