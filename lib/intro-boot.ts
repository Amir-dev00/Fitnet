/** Runs before hydration. Class toggles plus one bounded release. React owns the video node. */
export const introBoot = `
(function () {
  var root = document.documentElement;
  var scrolled = false;
  function release() {
    root.classList.remove("fn-hold");
    root.classList.remove("fn-preloading");
    root.classList.add("fn-reveal");
    root.dataset.fnIntroReleased = "1";
    var page = document.getElementById("fn-page");
    if (page) page.inert = false;
    if (scrolled) return;
    scrolled = true;
    var y = window.__fnIntroScroll || 0;
    try { window.scrollTo(0, y); } catch (e) {}
  }
  window.__fnIntroRelease = release;
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) release();
  });
  var path = location.pathname;
  var home = path === "/" || path === "/index.html";
  if (!home) {
    root.classList.add("fn-reveal");
    root.dataset.fnIntroReleased = "1";
    return;
  }
  try {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("fn-reveal", "fn-intro-skip");
      release();
      return;
    }
  } catch (e) {}
  var probe = document.createElement("video");
  if (!probe.canPlayType || probe.canPlayType('video/webm; codecs="vp9"') === "") {
    root.classList.add("fn-reveal", "fn-intro-skip");
    release();
    return;
  }
  window.__fnIntroScroll = window.scrollY || 0;
  window.__fnIntroDeadline = Date.now() + 5000;
  root.classList.add("fn-hold");
  root.classList.add("fn-preloading");
  setTimeout(release, 5000);
})();
`