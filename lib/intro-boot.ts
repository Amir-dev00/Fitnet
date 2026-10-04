/** Runs before hydration. It only toggles classes and a 5s release. React owns the video node. */
export const introBoot = `
(function () {
  var root = document.documentElement;
  function release() {
    if (root.dataset.fnIntroReleased === "1") return;
    root.dataset.fnIntroReleased = "1";
    root.classList.remove("fn-hold");
    root.classList.remove("fn-preloading");
    root.classList.add("fn-reveal");
    var page = document.getElementById("fn-page");
    if (page) page.inert = false;
    var y = window.__fnIntroScroll || 0;
    try { window.scrollTo(0, y); } catch (e) {}
  }
  window.__fnIntroRelease = release;
  var path = location.pathname;
  var home = path === "/" || path === "/index.html";
  if (!home) { root.classList.add("fn-reveal"); return; }
  try { if (matchMedia("(prefers-reduced-motion: reduce)").matches) { root.classList.add("fn-reveal", "fn-intro-skip"); return; } } catch (e) {}
  var probe = document.createElement("video");
  if (!probe.canPlayType || probe.canPlayType('video/webm; codecs="vp9"') === "") {
    root.classList.add("fn-reveal", "fn-intro-skip");
    return;
  }
  window.__fnIntroScroll = window.scrollY || 0;
  window.__fnIntroDeadline = Date.now() + 5000;
  root.classList.add("fn-hold");
  root.classList.add("fn-preloading");
  setTimeout(release, 5000);
})();
`