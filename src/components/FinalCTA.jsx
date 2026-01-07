export default function FinalCTA({ setPage }) {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>Apply Smarter. Not Harder.</h2>
      <p style={{ color: "var(--muted)", marginTop: "12px" }}>
        Stop guessing. Start applying with clarity.
      </p>

      <button style={{ marginTop: "28px" }} onClick={() => setPage("signin")}>
        Get Started
      </button>
    </section>
  );
}
