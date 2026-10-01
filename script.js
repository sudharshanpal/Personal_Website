// Small progressive enhancements. The site works fine without any of this.
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  if (!("IntersectionObserver" in window)) return;

  // ---- Highlight the nav link for the section in view ----
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      var link = byId[entry.target.id];
      if (link) link.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  Object.keys(byId).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // ---- Gentle fade-in for section content (skipped for reduced motion) ----
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    var targets = document.querySelectorAll(".role, .project, .interest, .skills, .edu, .about-grid");
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }
})();

// ---- Copy email ----
document.addEventListener("click", function (e) {
  var btn = e.target.closest(".copy-btn");
  if (!btn) return;
  var status = btn.parentElement.querySelector(".copy-status");
  var text = btn.getAttribute("data-copy");

  function done(msg) {
    if (!status) return;
    status.textContent = msg;
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { status.textContent = ""; }, 2000);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      function () { done("Copied."); },
      function () { done("Couldn't copy, sorry."); }
    );
  } else {
    done("Copy not supported here.");
  }
});
