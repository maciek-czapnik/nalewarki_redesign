// Progressive-enhancement step wizard for the quote-request form.
// Without JS, every .wizard-step is visible and the form is one long
// scrollable page (still fully submittable). With JS, this shows one
// step at a time with a progress bar and per-step validation.
// Localized text (labels/errors) comes from data-* attributes set by
// each page, so this script never hardcodes Polish or English text.
(function () {
  var wizard = document.querySelector(".wizard");
  if (!wizard) return;

  var steps = Array.prototype.slice.call(wizard.querySelectorAll(".wizard-step"));
  if (!steps.length) return;

  wizard.classList.add("js-enabled");

  var progressText = wizard.querySelector(".wizard-progress-current");
  var progressFill = wizard.querySelector(".wizard-progress-fill");
  var stepLabelTemplate = wizard.dataset.stepLabel || "{current} / {total}";
  var currentIndex = 0;

  function render(shouldScroll) {
    steps.forEach(function (step, i) {
      step.classList.toggle("is-active", i === currentIndex);
    });

    var total = steps.length;
    var current = currentIndex + 1;

    if (progressText) {
      progressText.textContent = stepLabelTemplate
        .replace("{current}", current)
        .replace("{total}", total);
    }
    if (progressFill) {
      progressFill.style.width = (current / total) * 100 + "%";
    }

    if (shouldScroll) {
      wizard.querySelector(".wizard-progress").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function validateStep(step) {
    var fields = Array.prototype.slice.call(step.querySelectorAll("input, select, textarea"));
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) {
        fields[i].reportValidity();
        return false;
      }
    }
    return true;
  }

  wizard.querySelectorAll(".wizard-next").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!validateStep(steps[currentIndex])) return;
      if (currentIndex < steps.length - 1) {
        currentIndex++;
        render(true);
      }
    });
  });

  wizard.querySelectorAll(".wizard-prev").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        render(true);
      }
    });
  });

  render(false);
})();
