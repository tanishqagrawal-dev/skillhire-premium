import { useState } from "react";

export default function CareerSimulator() {
  const [weeks, setWeeks] = useState(0);

  return (
    <section>
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        <h2>Career Growth Simulator</h2>
        <p style={{ color: "var(--muted)" }}>
          See how focused preparation improves your readiness over time.
        </p>

        <input
          type="range"
          min="0"
          max="12"
          value={weeks}
          onChange={e => setWeeks(Number(e.target.value))}
          style={{ marginTop: "30px", width: "100%" }}
        />

        <p style={{ marginTop: "20px" }}>
          After <strong>{weeks} weeks</strong> of focused learning:
        </p>

        <p style={{ fontSize: "20px", color: "var(--accent)" }}>
          Job Readiness: {60 + weeks * 2}%
        </p>
      </div>
    </section>
  );
}
