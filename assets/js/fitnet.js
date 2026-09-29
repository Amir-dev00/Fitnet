(function () {
  var content = window.FITNET_CONTENT || { endpoint: null, faqs: [], guides: {} };

  function digits(value) {
    var map = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9", "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
    return String(value || "").replace(/[۰-۹٠-٩]/g, function (d) { return map[d]; }).replace(/\D/g, "");
  }

  function mobileOk(value) {
    return /^09\d{9}$/.test(digits(value));
  }

  function text(el, value) {
    el.textContent = value;
  }

  function renderFaq() {
    document.querySelectorAll("[data-fn-faq]").forEach(function (root) {
      content.faqs.forEach(function (item) {
        var details = document.createElement("details");
        var summary = document.createElement("summary");
        var answer = document.createElement("div");
        summary.textContent = item[0];
        answer.className = "fn-a";
        answer.textContent = item[1];
        details.appendChild(summary);
        details.appendChild(answer);
        root.appendChild(details);
      });
    });
  }

  function bindForms() {
    document.querySelectorAll("[data-fitnet-form]").forEach(function (form) {
      var msg = form.querySelector(".fn-form-msg");
      var busy = false;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (busy) return;
        if (msg) {
          msg.classList.remove("is-error");
          text(msg, "");
        }
        var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea, select"));
        var invalid = null;
        fields.forEach(function (field) {
          field.removeAttribute("aria-invalid");
          if (field.type === "hidden" || field.disabled) return;
          if (field.required && !String(field.value || "").trim()) invalid = invalid || field;
          if (field.name === "mobile" && !mobileOk(field.value)) invalid = invalid || field;
        });
        if (invalid) {
          invalid.setAttribute("aria-invalid", "true");
          invalid.focus();
          if (msg) {
            msg.classList.add("is-error");
            text(msg, invalid.name === "mobile" ? "شماره موبایل را با ۰۹ و ۱۱ رقم وارد کن." : "این فیلد را کامل کن.");
          }
          return;
        }
        busy = true;
        var button = form.querySelector("button");
        if (button) button.disabled = true;
        var lines = fields.filter(function (field) {
          return field.name && String(field.value || "").trim();
        }).map(function (field) {
          var label = form.querySelector('label[for="' + field.id + '"]');
          return (label ? label.textContent : field.name) + ": " + String(field.value).trim();
        });
        window.setTimeout(function () {
          busy = false;
          if (button) button.disabled = false;
          if (!content.endpoint) {
            var review = form.querySelector(".fn-review");
            if (!review) {
              review = document.createElement("div");
              review.className = "fn-review";
              form.appendChild(review);
            }
            review.textContent = "پیش‌نمایش درخواست:\n" + lines.join("\n");
            if (msg) text(msg, "این فرم در نسخه نمایشی ارسال نمی‌شود.");
            return;
          }
        }, 250);
      });
    });
  }

  function guidePage() {
    var root = document.querySelector("[data-fn-guide]");
    if (!root) return;
    var slug = new URLSearchParams(location.search).get("slug") || "";
    var guide = content.guides[slug];
    var title = document.getElementById("fn-guide-title");
    var body = document.getElementById("fn-guide-body");
    var related = document.getElementById("fn-guide-related");
    if (!guide) {
      if (title) title.textContent = "این راهنما پیدا نشد";
      if (body) {
        var p = document.createElement("p");
        p.textContent = "راهنمای درخواستی در فهرست فیت‌نت نیست. از راهنماها یکی را انتخاب کن.";
        body.appendChild(p);
      }
    } else {
      document.title = guide.title + " | فیت‌نت";
      if (title) title.textContent = guide.title;
      guide.paragraphs.forEach(function (paragraph) {
        var p = document.createElement("p");
        p.textContent = paragraph;
        body.appendChild(p);
      });
    }
    Object.keys(content.guides).forEach(function (key) {
      if (key === slug) return;
      var a = document.createElement("a");
      a.href = "blog-post.html?slug=" + encodeURIComponent(key);
      a.textContent = content.guides[key].title;
      related.appendChild(a);
    });
  }

  function guideIndex() {
    var list = document.querySelector("[data-fn-guides]");
    if (!list) return;
    var search = document.querySelector("[data-fn-search]");
    var cats = document.querySelector("[data-fn-cats]");
    var active = "همه";
    var categories = ["همه"];
    Object.keys(content.guides).forEach(function (key) {
      if (categories.indexOf(content.guides[key].category) === -1) categories.push(content.guides[key].category);
    });
    function paint() {
      var q = search ? search.value.trim() : "";
      list.textContent = "";
      Object.keys(content.guides).forEach(function (key) {
        var guide = content.guides[key];
        var hay = guide.title + " " + guide.summary + " " + guide.category;
        if (active !== "همه" && guide.category !== active) return;
        if (q && hay.indexOf(q) === -1) return;
        var card = document.createElement("a");
        card.className = "fn-card";
        card.href = "blog-post.html?slug=" + encodeURIComponent(key);
        var h = document.createElement("h2");
        var p = document.createElement("p");
        h.textContent = guide.title;
        p.textContent = guide.summary;
        card.appendChild(h);
        card.appendChild(p);
        list.appendChild(card);
      });
      if (!list.childNodes.length) {
        var empty = document.createElement("p");
        empty.textContent = "راهنمایی با این عبارت پیدا نشد.";
        list.appendChild(empty);
      }
    }
    categories.forEach(function (name) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = name;
      button.setAttribute("aria-pressed", name === active ? "true" : "false");
      button.addEventListener("click", function () {
        active = name;
        cats.querySelectorAll("button").forEach(function (el) {
          el.setAttribute("aria-pressed", el === button ? "true" : "false");
        });
        paint();
      });
      cats.appendChild(button);
    });
    if (search) search.addEventListener("input", paint);
    paint();
  }

  function contactTabs() {
    var tabs = document.querySelector("[data-fn-tabs]");
    if (!tabs) return;
    var path = new URLSearchParams(location.search).get("path") || "early";
    if (["early", "gym", "organizer"].indexOf(path) === -1) path = "early";
    function show(name) {
      tabs.querySelectorAll("button").forEach(function (button) {
        button.setAttribute("aria-selected", button.dataset.path === name ? "true" : "false");
      });
      document.querySelectorAll("[data-fn-panel]").forEach(function (panel) {
        panel.hidden = panel.dataset.fnPanel !== name;
      });
    }
    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      show(button.dataset.path);
      history.replaceState(null, "", "contact.html?path=" + button.dataset.path);
    });
    show(path);
  }

  function drawer() {
    if (!window.Alpine || !document.body || !document.body.hasAttribute("x-data")) return;
    var opener = document.querySelector("[aria-label='منو']");
    var wasOpen = false;
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      var data = Alpine.$data(document.body);
      if (!data) return;
      data.mobOpen = false;
      data.menu = null;
      data.searchOpen = false;
    });
    if (typeof Alpine.effect === "function") {
      Alpine.effect(function () {
        var open = !!Alpine.$data(document.body).mobOpen;
        document.body.classList.toggle("fn-lock", open);
        if (wasOpen && !open && opener) opener.focus();
        wasOpen = open;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFaq();
    bindForms();
    guidePage();
    guideIndex();
    contactTabs();
    drawer();
  });
})();
