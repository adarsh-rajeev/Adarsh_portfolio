// Navbar hamburger + theme toggle + footer year + close on link
(function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    const toggle = () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    };
    hamburger.addEventListener("click", toggle);
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") toggle();
    });

    // Close on link click
    navMenu.querySelectorAll(".nav-link").forEach((n) =>
      n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      })
    );
  }

  // Theme toggle with persistence
  const toggleSwitch = document.querySelector("#switch");
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (toggleSwitch) toggleSwitch.checked = theme === "dark";
  };

  // Init from storage or prefers-color-scheme
  const stored = localStorage.getItem("theme");
  if (stored) {
    applyTheme(stored);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  if (toggleSwitch) {
    toggleSwitch.addEventListener(
      "change",
      (e) => {
        const mode = e.target.checked ? "dark" : "light";
        applyTheme(mode);
        localStorage.setItem("theme", mode);
      },
      false
    );
  }

  // Footer year
  const myDate = document.querySelector("#datee");
  if (myDate) myDate.textContent = new Date().getFullYear();
})();
