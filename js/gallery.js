// Product photo gallery + lightbox.
// Images are declared directly in each page's HTML (button > img[data-src]),
// never constructed here — keeps this script safe to load from any directory
// depth (root or /en/) without path-rewriting.
(function () {
  var grid = document.getElementById("gallery");
  if (!grid) return;

  var buttons = Array.prototype.slice.call(grid.querySelectorAll("button"));
  if (!buttons.length) return;

  var images = buttons.map(function (btn) {
    var img = btn.querySelector("img");
    return { src: img.dataset.src, alt: img.alt };
  });

  // Lazy-load: swap data-src -> src when a thumbnail scrolls into view.
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener(
          "load",
          function () {
            img.classList.add("is-visible");
          },
          { once: true }
        );
        observer.unobserve(img);
      });
    },
    { threshold: 0.05 }
  );

  buttons.forEach(function (btn) {
    observer.observe(btn.querySelector("img"));
  });

  // Lightbox
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var closeBtn = document.getElementById("lightboxClose");
  var prevBtn = document.getElementById("lightboxPrev");
  var nextBtn = document.getElementById("lightboxNext");
  var currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    var target = images[currentIndex];
    lightboxImg.style.opacity = 0;
    window.setTimeout(function () {
      lightboxImg.src = target.src;
      lightboxImg.alt = target.alt;
      lightboxImg.style.opacity = 1;
    }, 120);
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  buttons.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", function () {
    showImage(currentIndex - 1);
  });
  nextBtn.addEventListener("click", function () {
    showImage(currentIndex + 1);
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });

  // Touch swipe
  var touchStartX = 0;
  lightbox.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  lightbox.addEventListener(
    "touchend",
    function (e) {
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) < 50) return;
      showImage(currentIndex + (delta < 0 ? 1 : -1));
    },
    { passive: true }
  );
})();
