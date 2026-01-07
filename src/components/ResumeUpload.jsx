import { useState } from "react";

export default function ResumeUpload() {
  const [file,setFile] = useState(null);
  return (
    <section style={{padding:"120px 0",textAlign:"center"}}>
      <h2>Upload Resume</h2>
      <input type="file" accept=".pdf" onChange={e=>setFile(e.target.files[0])}/>
      {file && <p>{file.name} uploaded</p>}
    </section>
  );
}
