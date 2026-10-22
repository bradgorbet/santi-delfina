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
  var page = document.body.getAttribute("data-page");

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
  function countLabel(n) { return n === 1 ? "1 accomplishment" : n + " accomplishments"; }

  function nav() {
    return '<nav class="sitenav" aria-label="Site"><a class="home" href="/"' + (page === "home" ? ' aria-current="page"' : '') + '>Gorbejar</a>' +
      KIDS.map(function (k) {
        return '<a href="/' + k + '/"' + (page === k ? ' aria-current="page"' : '') + '>' + esc(data[k].name) + '</a>';
      }).join("") + '</nav>';
  }

  function renderHome() {
    var h = '<div class="wrap">' + nav();
    h += '<header class="top"><p class="eyebrow">Our family\'s proud moments</p><h1>The Gorbejar kids</h1>' +
      '<p class="lede">A place for grandparents, family and friends to keep up with what ' +
      esc(data.santi.name) + ' and ' + esc(data.delfina.name) + ' have been up to.</p></header>';
    h += '<div class="kids">' + KIDS.map(function (k) {
      var kid = data[k];
      return '<a class="kidcard ' + k + '" href="/' + k + '/"><span class="name">' + esc(kid.name) + '</span>' +
        (kid.about ? '<p class="about">' + esc(kid.about) + '</p>' : '') +
        (kid.entries.length ? '<span class="meta">' + countLabel(kid.entries.length) + '</span>' : '') +
        '<span class="go">See ' + esc(kid.name) + '\'s page →</span></a>';
    }).join("") + '</div>';
    h += '<footer>Made with love for grandparents, family and friends.</footer></div>';
    return h;
  }

  function renderKid(k) {
    var kid = data[k];
    var h = '<div class="wrap kid" data-kid="' + k + '">' + nav();
    h += '<div class="intro"><h1 style="font-size:clamp(40px,8vw,64px);color:var(--accent)">' + esc(kid.name) + '</h1>';
    if (kid.about) h += '<p class="about">' + esc(kid.about) + '</p>';
    if (kid.entries.length) h += '<p class="tally">' + countLabel(kid.entries.length) + '</p>';
    h += '</div>';

    var shown = CATS.filter(function (c) { return entriesFor(k, c.key).length; });
    if (!shown.length) {
      h += '<div class="coming">' + esc(kid.name) + '\'s accomplishments are on their way. Check back soon.</div>';
    } else {
      h += '<div class="shelves">' + shown.map(function (c) {
        var list = entriesFor(k, c.key);
        return '<div class="shelf"><h2 class="shelf-title">' + c.label + ' <span class="count">' + list.length + '</span></h2>' +
          '<div class="cards">' + list.map(function (e) {
            return '<article class="card">' + (e.when ? '<span class="when">' + esc(fmtWhen(e.when)) + '</span>' : '') +
              '<h3>' + esc(e.title) + '</h3>' + (e.details ? '<p>' + esc(e.details) + '</p>' : '') + '</article>';
          }).join("") + '</div></div>';
      }).join("") + '</div>';
    }
    h += '<footer>Made with love for grandparents, family and friends.</footer></div>';
    return h;
  }

  document.getElementById("app").innerHTML = KIDS.indexOf(page) >= 0 ? renderKid(page) : renderHome();
})();
