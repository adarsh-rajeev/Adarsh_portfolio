// Contact form -> Open Gmail compose with prefilled data.
// No fallback warning if popup blocked; button just resets.
// Shows a brief success message only if Gmail opens.

(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = document.getElementById("formStatus");
  const EMAIL_TO = "adarshadhi1205@gmail.com";

  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    subject: form.querySelector("#subject"),
    message: form.querySelector("#message"),
    honeypot: form.querySelector("#company"),
  };

  function setError(id, msg) {
    const el = form.querySelector(`[data-error-for="${id}"]`);
    if (el) el.textContent = msg || "";
  }

  function validate() {
    let ok = true;

    const name = fields.name.value.trim();
    if (name && name.length < 2) {
      setError("name", "Too short");
      ok = false;
    } else setError("name", "");

    const email = fields.email.value.trim();
    if (!email) {
      setError("email", "Required");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Invalid");
      ok = false;
    } else setError("email", "");

    const subj = fields.subject.value.trim();
    if (!subj) {
      setError("subject", "Required");
      ok = false;
    } else setError("subject", "");

    const msg = fields.message.value.trim();
    if (!msg) {
      setError("message", "Required");
      ok = false;
    } else if (msg.length < 5) {
      setError("message", "Too short");
      ok = false;
    } else setError("message", "");

    if (fields.honeypot.value) ok = false;

    return ok;
  }

  function buildGmailURL() {
    const name = fields.name.value.trim() || "N/A";
    const fromEmail = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const message = fields.message.value.trim();

    const bodyLines = [`Name: ${name}`, `Email: ${fromEmail}`, "", message];
    const body = encodeURIComponent(bodyLines.join("\n"));

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      EMAIL_TO
    )}&su=${encodeURIComponent(subject)}&body=${body}&tf=1`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    form.classList.remove("success", "error");

    if (!validate()) {
      statusEl.textContent = "Please correct the highlighted fields.";
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.classList.add("sending");
    btn.textContent = "OPENING...";

    const gmailURL = buildGmailURL();
    let popup = null;
    try {
      popup = window.open(gmailURL, "_blank", "noopener");
    } catch (_) {
      /* ignore */
    }

    setTimeout(() => {
      const opened = popup && !popup.closed;
      if (opened) {
        statusEl.innerHTML =
          '<span class="sent-msg">Gmail compose opened.</span>';
        form.classList.add("success");
        btn.textContent = "OPENED ✓";
        btn.classList.remove("sending");
        btn.classList.add("sent");
        setTimeout(() => form.reset(), 400);
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.classList.remove("sent");
        }, 3000);
      } else {
        // Popup blocked silently
        btn.disabled = false;
        btn.textContent = originalText;
        btn.classList.remove("sending");
      }
    }, 600);
  });
})();
