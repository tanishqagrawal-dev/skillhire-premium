import { useState } from "react";

const companies = [
  { name:"Google", score:72, note:"System design heavy" },
  { name:"Amazon", score:65, note:"Backend + leadership" },
  { name:"Startup", score:81, note:"Hands-on execution" }
];

export default function CompanyReadiness() {
  const [active,setActive] = useState(0);
  return (
    <section style={{padding:"120px 0"}}>
      <div style={{maxWidth:"1100px",margin:"auto",padding:"0 24px"}}>
        <h2>Company-Specific Readiness</h2>
        <div style={{marginTop:"32px"}}>
          {companies.map((c,i)=>(
            <button key={i} onClick={()=>setActive(i)} style={{marginRight:"12px"}}>
              {c.name}
            </button>
          ))}
        </div>
        <p style={{marginTop:"24px"}}>
          {companies[active].score}% — {companies[active].note}
        </p>
      </div>
    </section>
  );
}
