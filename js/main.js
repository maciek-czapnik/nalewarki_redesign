// Mobile nav toggle
(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("navMain");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

// Footer year
(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Cookie consent banner (guarded for private-mode/file:// where localStorage can throw)
(function () {
  var banner = document.getElementById("cookieBanner");
  var acceptBtn = document.getElementById("cookieAccept");
  if (!banner || !acceptBtn) return;

  var STORAGE_KEY = "nalewarki24_cookie_consent";

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (e) {
      /* ignore — private mode / file:// */
    }
  }

  if (!getConsent()) {
    banner.classList.add("is-visible");
  }

  acceptBtn.addEventListener("click", function () {
    setConsent();
    banner.classList.remove("is-visible");
  });
})();
