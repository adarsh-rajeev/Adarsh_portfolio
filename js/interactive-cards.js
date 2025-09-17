// Interactive spotlight + 3D tilt on project and skill cards, and magnetic buttons
(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isHoverCapable = window.matchMedia("(hover: hover)").matches;

  // Include both project cards and skill cards
  const cards = Array.from(
    document.querySelectorAll(".project .card, #skills .skill-card")
  );
  // Include buttons from either section (skills may have none)
  const buttons = Array.from(
    document.querySelectorAll(".project .card .btn, #skills .skill-card .btn")
  );

  if (prefersReducedMotion || cards.length === 0) return;

  const states = cards.map((card, i) => ({
    el: card,
    hovered: false,
    tx: 0.5 + 0.02 * Math.cos(i), // target spotlight (0..1)
    ty: 0.5 + 0.02 * Math.sin(i),
    x: 0.5,
    y: 0.5, // current spotlight
    tTiltX: 0,
    tTiltY: 0, // target tilt
    tiltX: 0,
    tiltY: 0, // current tilt
    phase: Math.random() * Math.PI * 2,
  }));

  if (isHoverCapable) {
    states.forEach((s) => {
      const rectOf = () => s.el.getBoundingClientRect();

      s.el.addEventListener("mouseenter", () => {
        s.hovered = true;
      });

      s.el.addEventListener("mousemove", (e) => {
        const r = rectOf();
        const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
        const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
        s.tx = px;
        s.ty = py;

        const maxTiltX = 12,
          maxTiltY = 16;
        s.tTiltY = (px - 0.5) * maxTiltY; // rotateY
        s.tTiltX = (0.5 - py) * maxTiltX; // rotateX
      });

      s.el.addEventListener("mouseleave", () => {
        s.hovered = false;
        s.tTiltX = 0;
        s.tTiltY = 0;
      });
    });
  }

  // Magnetic buttons
  if (isHoverCapable) {
    buttons.forEach((btn) => {
      const maxTranslate = 6;
      const reset = () => {
        btn.style.transform = "translate3d(0,0,0)";
      };
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const nx = Math.max(-1, Math.min(1, dx / (r.width / 2)));
        const ny = Math.max(-1, Math.min(1, dy / (r.height / 2)));
        btn.style.transform = `translate3d(${nx * maxTranslate}px, ${
          ny * maxTranslate
        }px, 0)`;
      });
      btn.addEventListener("mouseleave", reset);
      btn.addEventListener("blur", reset);
    });
  }

  // RAF loop
  let last = performance.now();
  const loop = (t) => {
    const dt = Math.min(32, t - last);
    last = t;

    states.forEach((s, i) => {
      if (!s.hovered) {
        const speed = 0.00035;
        const ax = Math.sin(t * speed + s.phase + i * 0.6) * 0.08;
        const ay = Math.cos(t * speed + s.phase + i * 0.6) * 0.06;
        s.tx = 0.5 + ax;
        s.ty = 0.5 + ay;
      }

      const ease = 0.12;
      s.x += (s.tx - s.x) * ease;
      s.y += (s.ty - s.y) * ease;

      s.tiltX += (s.tTiltX - s.tiltX) * 0.15;
      s.tiltY += (s.tTiltY - s.tiltY) * 0.15;

      s.el.style.setProperty("--mx", (s.x * 100).toFixed(2) + "%");
      s.el.style.setProperty("--my", (s.y * 100).toFixed(2) + "%");
      s.el.style.setProperty("--tiltX", s.tiltX.toFixed(3) + "deg");
      s.el.style.setProperty("--tiltY", s.tiltY.toFixed(3) + "deg");
    });

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
