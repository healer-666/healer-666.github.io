// Post page enhancements. Everything degrades to plain links and native <details> without JS.
(function () {
  "use strict";

  var WIDE = window.matchMedia("(min-width: 1180px)");

  // --- Table of contents: always open beside the article, collapsed by default above it.
  var toc = document.querySelector(".post-toc");
  if (toc) {
    var summary = toc.querySelector("summary");
    var syncToc = function () { toc.open = WIDE.matches; };
    syncToc();
    WIDE.addEventListener("change", syncToc);
    summary.addEventListener("click", function (event) {
      if (WIDE.matches) event.preventDefault(); // sidebar TOC is not collapsible
    });
    toc.addEventListener("click", function (event) {
      // Collapse the mobile TOC before the theme's anchor handler scrolls,
      // so the scroll target is computed with the final layout (capture phase).
      if (!WIDE.matches && event.target.closest("a")) toc.open = false;
    }, true);

    // Highlight the section currently being read.
    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    var targets = links.map(function (link) {
      return document.getElementById(decodeURIComponent(link.hash.slice(1)));
    });
    var current = null;
    var update = function () {
      var offset = window.innerHeight * 0.25;
      var index = -1;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && targets[i].getBoundingClientRect().top <= offset) index = i;
      }
      var link = links[index] || null;
      if (link === current) return;
      if (current) current.removeAttribute("aria-current");
      current = link;
      if (!link) return;
      link.setAttribute("aria-current", "location");
      if (WIDE.matches && toc.scrollHeight > toc.clientHeight) {
        // Keep the active item visible inside the independently scrolling sidebar.
        var top = link.offsetTop - toc.clientHeight / 2;
        toc.scrollTop = Math.max(0, top);
      }
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // --- Image preview: a native modal <dialog>; the link still opens the file without JS.
  var dialog = document.querySelector(".lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    var preview = dialog.querySelector(".lightbox__img");
    var opener = null;
    document.addEventListener("click", function (event) {
      var link = event.target.closest("a[data-lightbox]");
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      var img = link.querySelector("img");
      opener = link;
      preview.src = link.getAttribute("href");
      preview.alt = img ? img.alt : "";
      dialog.showModal();
    });
    dialog.addEventListener("click", function (event) {
      // Click on the backdrop or the image closes; the close button submits the form.
      if (event.target === dialog || event.target === preview) dialog.close();
    });
    dialog.addEventListener("close", function () {
      preview.removeAttribute("src");
      if (opener) opener.focus();
    });
  }
})();
