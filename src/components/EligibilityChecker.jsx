import { useState } from "react";

export default function EligibilityChecker() {
  const [skills, setSkills] = useState("");
  const required = ["DSA", "Backend", "Projects"];

  const eligible = required.every(r =>
    skills.toLowerCase().includes(r.toLowerCase())
  );

  return (
    <section>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <h2>Job Eligibility Checker</h2>
        <p style={{ color: "var(--muted)" }}>
          Enter your skills to check if applying makes sense.
        </p>

        <input
          placeholder="Example: DSA, Backend, React, Projects"
          onChange={e => setSkills(e.target.value)}
          style={{ marginTop: "20px" }}
        />

        <div style={{ marginTop: "20px" }}>
          {eligible ? (
            <p style={{ color: "var(--accent)" }}>
              ✔ Recommended to apply
            </p>
          ) : (
            <p style={{ color: "var(--danger)" }}>
              ✖ Improve skills before applying
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
