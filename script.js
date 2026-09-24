/* ==========================================================================
   AJA Security Services - website
   Vanilla JavaScript - no libraries required.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var quoteCard = document.getElementById("quote");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  navToggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("is-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024 && nav.classList.contains("is-open")) setNav(false);
  });

  /* ---------- "Get a Free Quote" buttons ----------
     Scroll to the quote form, pre-select the service (if the button has
     data-service), highlight the form and focus the first field. */
  var serviceSelect = document.getElementById("q-service");
  var firstField = document.getElementById("q-name");

  document.querySelectorAll("[data-quote]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (!quoteCard) return;
      e.preventDefault();
      setNav(false);

      var service = btn.getAttribute("data-service");
      if (service && serviceSelect) {
        serviceSelect.value = service;
        clearError(serviceSelect);
      }

      quoteCard.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#quote");

      quoteCard.classList.remove("is-highlighted");
      void quoteCard.offsetWidth; // restart animation
      quoteCard.classList.add("is-highlighted");

      // Focus after scrolling finishes (without jumping the page)
      setTimeout(function () {
        if (firstField && document.body.contains(firstField)) {
          try { firstField.focus({ preventScroll: true }); } catch (err) { firstField.focus(); }
        }
      }, reduceMotion ? 0 : 650);
    });
  });

  /* ---------- Show date picker when "specific date" chosen ---------- */
  var whenSelect = document.getElementById("q-when");
  var dateField = document.getElementById("dateField");
  var dateInput = document.getElementById("q-date");
  if (dateInput) {
    var t = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    dateInput.min = t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
  }
  if (whenSelect && dateField) {
    whenSelect.addEventListener("change", function () {
      var show = whenSelect.value === "Specific date";
      dateField.hidden = !show;
      dateInput.required = show;
      if (!show) { dateInput.value = ""; clearError(dateInput); }
    });
  }

  /* ---------- Reveal-on-scroll animations ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el) {
      // Stagger cards that sit side by side
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
      var index = Array.prototype.indexOf.call(siblings, el);
      if (index > 0) el.style.transitionDelay = Math.min(index % 3, 2) * 90 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Form validation & submission (Formspree) ---------- */
  var messages = {
    name: "Please enter your full name.",
    phone: "Please enter a valid phone number.",
    email: "Please enter a valid email address.",
    location: "Please enter your town or postcode.",
    service: "Please choose the service you need.",
    when_required: "Please tell us when you need security.",
    date_required: "Please choose the date you need security.",
    guards_required: "Please enter a number between 1 and 500.",
    message: "Please tell us how we can help."
  };

  function fieldWrap(input) { return input.closest(".field"); }

  function showError(input, text) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    wrap.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    var err = wrap.querySelector(".field__error");
    if (!err) {
      err = document.createElement("span");
      err.className = "field__error";
      err.id = input.id + "-error";
      wrap.appendChild(err);
      input.setAttribute("aria-describedby", err.id);
    }
    err.textContent = text;
  }

  function clearError(input) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    wrap.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
    var err = wrap.querySelector(".field__error");
    if (err) err.remove();
    input.removeAttribute("aria-describedby");
  }

  function isValid(input) {
    var v = input.value.trim();
    if (input.required && !v) return false;
    if (!v) return true;
    if (input.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (input.type === "tel") return v.replace(/[^\d]/g, "").length >= 10 && /^[\d\s()+-]+$/.test(v);
    if (input.type === "number") {
      var n = Number(v);
      return Number.isInteger(n) && n >= Number(input.min || 1) && n <= Number(input.max || 9999);
    }
    return true;
  }

  function validate(form) {
    var firstBad = null;
    form.querySelectorAll("input:not([type=hidden]):not([name=_gotcha]), select, textarea").forEach(function (input) {
      if (input.closest("[hidden]")) { clearError(input); return; }
      if (!isValid(input)) {
        showError(input, messages[input.name] || "Please check this field.");
        if (!firstBad) firstBad = input;
      } else {
        clearError(input);
      }
    });
    return firstBad;
  }

  function setStatus(form, text, type) {
    var status = form.querySelector(".form__status");
    status.className = "form__status" + (type ? " is-" + type : "");
    status.textContent = text;
  }

  function showSuccess(form) {
    var phoneLink = document.querySelector('a[href^="tel:"]');
    var phoneHtml = phoneLink ? '<a href="' + phoneLink.getAttribute("href") + '">' + phoneLink.textContent.replace(/\s*Call\s*/i, "").trim() + "</a>" : "us";
    var box = document.createElement("div");
    box.className = "form-success";
    box.setAttribute("tabindex", "-1");
    box.innerHTML =
      '<div class="form-success__icon"><svg class="i" aria-hidden="true"><use href="#i-check"/></svg></div>' +
      "<h3>Thank You</h3>" +
      "<p>Your request has been sent. A member of our team will be in touch shortly.<br>Need us urgently? Call " + phoneHtml + ".</p>";
    form.replaceWith(box);
    box.focus();
  }

  document.querySelectorAll(".js-form").forEach(function (form) {
    // Clear errors as the visitor types
    form.addEventListener("input", function (e) {
      if (fieldWrap(e.target) && fieldWrap(e.target).classList.contains("has-error") && isValid(e.target)) clearError(e.target);
    });
    form.addEventListener("change", function (e) {
      if (fieldWrap(e.target) && isValid(e.target)) clearError(e.target);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus(form, "", "");

      var bad = validate(form);
      if (bad) {
        bad.focus();
        setStatus(form, "Please check the highlighted fields.", "error");
        return;
      }

      // Setup check: the Formspree ID has not been added yet
      if (form.action.indexOf("FORMSPREE_FORM_ID") !== -1 || form.action.indexOf("%5BFORMSPREE") !== -1) {
        setStatus(form, "Website owner: this form isn't connected yet. Replace [FORMSPREE_FORM_ID] in index.html with your Formspree form ID (see README).", "info");
        return;
      }

      var btn = form.querySelector(".form__submit");
      btn.classList.add("is-loading");
      btn.setAttribute("aria-busy", "true");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) return showSuccess(form);
          return res.json().then(function (data) {
            var msg = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(" ") : "";
            throw new Error(msg);
          });
        })
        .catch(function () {
          setStatus(form, "Sorry, something went wrong sending your request. Please try again or call us directly.", "error");
        })
        .then(function () {
          btn.classList.remove("is-loading");
          btn.removeAttribute("aria-busy");
        });
    });
  });
})();
