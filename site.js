(function () {
  var data = window.ACCOMPLISHMENTS;
  var CATS = [
    { key: "awards", label: "Awards" },
    { key: "sports", label: "Sports" },
    { key: "school", label: "School" },
    { key: "art", label: "Art" },
    { key: "music", label: "Music" },
    { key: "milestones", label: "Milestones" },
    { key: "projects", label: "Projects" }
  ];
  var KIDS = ["santi", "delfina"];
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  var current = (location.hash || "").slice(1);
  if (KIDS.indexOf(current) < 0) current = "santi";

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmtWhen(v) {
    if (!v) return "";
    var m = /^(\d{4})-(\d{2})$/.exec(v);
    return m ? MONTHS[+m[2] - 1] + " " + m[1] : v;
  }
  function entriesFor(kid, cat) {
    return data[kid].entries.filter(function (e) { return e.cat === cat; })
      .sort(function (a, b) { return (b.when || "").localeCompare(a.when || ""); });
  }

  function render() {
    var kid = data[current];
    var total = kid.entries.length;
    var h = '<div class="wrap">';
    h += '<header class="top"><p class="eyebrow">Our family\'s proud moments</p>' +
      '<h1><span class="s">' + esc(data.santi.name) + '</span> <span class="amp">&amp;</span> <span class="d">' + esc(data.delfina.name) + '</span></h1></header>';
    h += '<div class="tabs" role="tablist">' + KIDS.map(function (k) {
      return '<button class="tab" role="tab" id="tab-' + k + '" data-kid="' + k + '" aria-selected="' + (k === current) + '">' + esc(data[k].name) + '</button>';
    }).join("") + '</div>';

    h += '<section class="kid" data-kid="' + current + '" role="tabpanel" aria-labelledby="tab-' + current + '">';
    h += '<div class="intro"><h2>' + esc(kid.name) + '</h2>';
    if (kid.about) h += '<p class="about">' + esc(kid.about) + '</p>';
    h += '<p class="tally">' + (total === 1 ? "1 accomplishment" : total + " accomplishments") + '</p></div>';

    var shown = CATS.filter(function (c) { return entriesFor(current, c.key).length; });
    if (!shown.length) {
      h += '<div class="coming">' + esc(kid.name) + '\'s accomplishments are on their way. Check back soon.</div>';
    } else {
      h += '<div class="shelves">' + shown.map(function (c) {
        var list = entriesFor(current, c.key);
        return '<div class="shelf"><h3>' + c.label + ' <span class="count">' + list.length + '</span></h3>' +
          '<div class="cards">' + list.map(function (e) {
            return '<article class="card">' + (e.when ? '<span class="when">' + esc(fmtWhen(e.when)) + '</span>' : '') +
              '<h4>' + esc(e.title) + '</h4>' + (e.details ? '<p>' + esc(e.details) + '</p>' : '') + '</article>';
          }).join("") + '</div></div>';
      }).join("") + '</div>';
    }
    h += '</section><footer>Made with love for grandparents, family and friends.</footer></div>';
    document.getElementById("app").innerHTML = h;
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest(".tab");
    if (!t) return;
    current = t.dataset.kid;
    try { history.replaceState(null, "", "#" + current); } catch (e) {}
    render();
  });
  window.addEventListener("hashchange", function () {
    var k = location.hash.slice(1);
    if (KIDS.indexOf(k) >= 0 && k !== current) { current = k; render(); }
  });

  render();
})();
