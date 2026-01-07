export default function CompanyMatrix() {
  const companies = [
    {
      name: "Google",
      focus: "DSA, System Design, Problem Solving",
      readiness: "72%",
      insight: "Strong fundamentals required. Weak system design leads to rejection."
    },
    {
      name: "Amazon",
      focus: "Backend Engineering, Leadership Principles",
      readiness: "65%",
      insight: "Evaluates decision making along with technical depth."
    },
    {
      name: "Startup",
      focus: "Hands-on Skills, Fast Execution",
      readiness: "81%",
      insight: "Real-world projects matter more than theory."
    }
  ];

  return (
    <section>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <h2>Company-Specific Readiness</h2>
        <p style={{ color: "var(--muted)", marginTop: "12px" }}>
          Readiness is not universal. Every company values different skills.
        </p>

        <div style={{ marginTop: "40px", display: "grid", gap: "24px" }}>
          {companies.map((c, i) => (
            <div key={i} className="panel">
              <h3>{c.name}</h3>
              <p style={{ color: "var(--muted)", marginTop: "6px" }}>
                <strong>Focus:</strong> {c.focus}
              </p>
              <p style={{ marginTop: "10px", color: "var(--accent)" }}>
                Readiness: {c.readiness}
              </p>
              <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--muted)" }}>
                🧠 {c.insight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
