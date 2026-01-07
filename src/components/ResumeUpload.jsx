import { useState } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Upload Resume</h2>
      <p style={{ color: "var(--muted)" }}>
        Upload your resume to start analysis.
      </p>

      <input
        type="file"
        accept=".pdf"
        onChange={e => setFile(e.target.files[0])}
        style={{ marginTop: "24px" }}
      />

      {file && (
        <p style={{ marginTop: "16px", color: "var(--accent)" }}>
          {file.name} uploaded successfully
        </p>
      )}
    </section>
  );
}
