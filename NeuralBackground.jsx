import { useEffect } from "react";

export default function NeuralBackground() {
  useEffect(() => {
    const c = document.getElementById("bg");
    const x = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    let dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    }));

    function draw() {
      x.clearRect(0, 0, c.width, c.height);
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > c.width) d.vx *= -1;
        if (d.y < 0 || d.y > c.height) d.vy *= -1;

        x.beginPath();
        x.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        x.fillStyle = "rgba(37,99,235,.6)";
        x.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  return <canvas id="bg" style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}
