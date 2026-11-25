const IMG = {
  lounge: "assets/images/lounge.jpg",
  "room-deluxe": "assets/images/room-deluxe.jpg",
  "room-cottage": "assets/images/room-cottage.jpg",
  "mashuuru-manor": "assets/images/mashuuru-manor.jpg",
  "sunrise-hike": "assets/images/sunrise-hike.jpg",
  "room-suite": "assets/images/room-suite.jpg",
};
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const kes = (n) => "KES " + Number(n).toLocaleString("en-KE");
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const pd = (s) => new Date(s + "T00:00:00");
const add = (s, n) => {
  const d = pd(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const today = iso(new Date());
const nights = (a, b) => Math.round((pd(b) - pd(a)) / 864e5);
const days = (a, b) => Array.from({ length: Math.max(0, nights(a, b)) }, (_, i) => add(a, i));
const pool = () =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d8a0"/><stop offset="1" stop-color="#cfe3e8"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4fc3d9"/><stop offset="1" stop-color="#2a8fb5"/></linearGradient></defs><rect width="800" height="600" fill="url(#s)"/><path d="M0 250 L130 140 L240 230 L380 100 L520 240 L650 150 L800 250 V320 H0Z" fill="#6f8a4e" opacity=".75"/><rect y="300" width="800" height="300" fill="#8a9a6a"/><rect x="90" y="340" width="620" height="210" rx="28" fill="#efe6d2"/><rect x="115" y="362" width="570" height="166" rx="18" fill="url(#w)"/><g stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none"><path d="M150 400q30-14 60 0t60 0 60 0 60 0 60 0 60 0 60 0"/><path d="M150 450q30-14 60 0t60 0 60 0 60 0 60 0 60 0 60 0"/><path d="M150 495q30-14 60 0t60 0 60 0 60 0 60 0 60 0 60 0"/></g><g fill="#e3b45f"><rect x="110" y="556" width="70" height="14" rx="6"/><rect x="620" y="556" width="70" height="14" rx="6"/></g><circle cx="650" cy="90" r="40" fill="#e3b45f" opacity=".85"/></svg>`,
  );
const img = (k) => (k === "pool" ? pool() : IMG[k] || IMG["room-deluxe"]);

/* ---------- data ---------- */
const KEY = "mm_state_v1";
function seed() {
  const rooms = [
    {
      id: "deluxe",
      name: "Meadow Deluxe Room",
      desc: "Soft linen, oak floors and a window onto the green valley.",
      price: 18500,
      units: 6,
      guests: 2,
      img: "room-deluxe",
      features: ["King bed", "Valley view", "Rain shower", "Free Wi-Fi", "Breakfast included"],
      closed: false,
      blocked: [],
    },
    {
      id: "suite",
      name: "Mountain View Suite",
      desc: "A freestanding bath and private balcony facing the misty peaks.",
      price: 28000,
      units: 4,
      guests: 3,
      img: "room-suite",
      features: ["Freestanding bath", "Private balcony", "Mountain view", "Lounge area", "Breakfast included"],
      closed: false,
      blocked: [],
    },
    {
      id: "cottage",
      name: "Garden Stone Cottage",
      desc: "Your own fireplace and terrace at the edge of the meadow.",
      price: 36000,
      units: 2,
      guests: 4,
      img: "room-cottage",
      features: ["Fireplace", "Private terrace", "Two bedrooms", "Garden access", "Breakfast included"],
      closed: false,
      blocked: [],
    },
  ];
  const packages = [
    {
      id: "honey",
      name: "Honeymoon Package",
      blurb: "Romantic stay with candle-lit dinner and spa.",
      price: 69000,
      nights: 2,
      roomId: "suite",
      img: "room-suite",
      inc: [
        "2 nights in the Mountain View Suite",
        "Candle-lit dinner on the terrace",
        "Couples spa session",
        "Sunrise hike for two",
        "Late check-out",
      ],
    },
    {
      id: "family",
      name: "Family Vacation",
      blurb: "Fun-filled stay for the entire family.",
      price: 95000,
      nights: 3,
      roomId: "cottage",
      img: "room-cottage",
      inc: [
        "3 nights in the Garden Stone Cottage",
        "All meals included",
        "Pool time and kids activities",
        "Guided meadow walk",
        "Airport transfers",
      ],
    },
    {
      id: "biz",
      name: "Business Stay",
      blurb: "Comfort and convenience for business travellers.",
      price: 48000,
      nights: 2,
      roomId: "deluxe",
      img: "lounge",
      inc: [
        "2 nights in the Meadow Deluxe Room",
        "Breakfast and working lunch",
        "High-speed Wi-Fi",
        "Quiet workspace in the lounge",
        "Airport transfers",
      ],
    },
  ];
  const b = (i, n, r, o, l, st, g = 2) => ({
    id: "s" + i,
    ref: "MM-S" + i,
    name: n,
    email: n.split(" ")[0].toLowerCase() + "@example.com",
    phone: "",
    ci: add(today, o),
    co: add(today, o + l),
    guests: g,
    roomId: r,
    pkgId: "",
    msg: "",
    status: st,
    total: 0,
    created: Date.now() - i * 36e5,
  });
  const bookings = [
    b(1, "Wanjiru Kamau", "cottage", 3, 4, "confirmed"),
    b(2, "Daniel Otieno", "cottage", 5, 4, "confirmed"),
    b(3, "Amina Hassan", "suite", 6, 3, "confirmed"),
    b(4, "Peter Mwangi", "suite", 6, 2, "new"),
    b(5, "Grace Njeri", "suite", 7, 3, "confirmed"),
    b(6, "Brian Kiptoo", "deluxe", 2, 3, "new"),
    b(7, "Lucy Achieng", "deluxe", 9, 2, "confirmed"),
  ];
  bookings.forEach((x) => {
    x.total = nights(x.ci, x.co) * rooms.find((r) => r.id === x.roomId).price;
  });
  return { rooms, packages, bookings: [], requests: [] };
}
const api = (d) =>
  fetch("api/index.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(d),
  })
    .then((r) => r.json())
    .catch(() => null);
let S,
  mem = null;
let known = { bookings: [], requests: [] };
const adopt = (st) => {
  S = st;
  S.bookings = S.bookings || [];
  S.requests = S.requests || [];
  known = { bookings: S.bookings.map((b) => b.id), requests: S.requests.map((r) => r.id) };
};
const load = () => S;
let saving = null;
const save = () => {
  if (!isAdmin()) return;
  clearTimeout(saving);
  saving = setTimeout(
    () =>
      api({ action: "adminSave", state: S, known }).then((r) => {
        if (r && r.ok) {
          adopt(r.state);
          if (!$("#admin").hidden) renderAdmin();
        } else if (r && r.error === "auth") {
          setAdmin(false);
          renderAdmin();
          toast("Session expired — please log in again.");
        } else toast("Could not save changes — check your connection.");
      }),
    250,
  );
};
adopt(seed());
const refresh = () =>
  api({ action: isAdmin() ? "adminState" : "state" }).then((r) => {
    if (r && r.ok) {
      adopt(r.state);
      return true;
    }
    if (r && r.error === "auth") {
      setAdmin(false);
    }
    return false;
  });
let search = { ci: "", co: "", guests: 2, promo: "" };
const room = (id) => S.rooms.find((r) => r.id === id);
const occ = (id, d, skip) =>
  S.bookings.filter((b) => b.status !== "cancelled" && b.roomId === id && b.id !== skip && b.ci <= d && d < b.co)
    .length;
const freeOn = (r, d, skip) => (r.closed || r.blocked.includes(d) ? 0 : Math.max(0, r.units - occ(r.id, d, skip)));
const freeRange = (r, a, b, skip) => days(a, b).reduce((m, d) => Math.min(m, freeOn(r, d, skip)), r.units);
const toast = (t) => {
  const e = document.createElement("div");
  e.className = "toast";
  e.textContent = t;
  document.body.append(e);
  setTimeout(() => e.remove(), 3200);
};
const badge = (r, a, b) => {
  if (r.closed) return '<span class="badge full">Not available</span>';
  if (!a || !b || b <= a) return '<span class="badge idle">Select dates to check</span>';
  const f = freeRange(r, a, b);
  return f <= 0
    ? '<span class="badge full">Fully booked for your dates</span>'
    : f <= 2
      ? `<span class="badge few">Only ${f} left for your dates</span>`
      : `<span class="badge">${f} available for your dates</span>`;
};

/* ---------- public rendering ---------- */
const AM = [
  [
    "⛰️",
    "Mountain views",
    "Wake up to sweeping views of the mountains from your room, balcony or the terrace.",
    "Other",
  ],
  [
    "🌲",
    "Nature walks",
    "Marked trails through 120 acres of meadow and indigenous woodland, with optional guides.",
    "Pool & activities",
  ],
  [
    "🔥",
    "Fireside lounge",
    "A stone-hearth lounge with warm drinks, board games and quiet corners. Open daily from 6 pm.",
    "Other",
  ],
  [
    "🍽️",
    "Farm-to-table dining",
    "Seasonal menus built from local farms. See our full menu and order to your room.",
    "Room service",
  ],
  [
    "🏊",
    "Swimming pool",
    "Heated outdoor pool, kids area, loungers and poolside bar. Open 6 am – 8 pm.",
    "Pool & activities",
  ],
  [
    "✨",
    "Spa & wellness",
    "Massages, facials and couples sessions in our quiet spa rooms. Bookings through the front desk.",
    "Spa & wellness",
  ],
  [
    "☕",
    "Breakfast included",
    "A full breakfast is served daily from 7 to 10 am with every room booking.",
    "Room service",
  ],
  [
    "🚗",
    "Airport transfers",
    "Private transfers from Jomo Kenyatta International Airport. Arrange with the front desk.",
    "Airport transfer",
  ],
  ["📶", "Free Wi-Fi", "Fast, free Wi-Fi across rooms, lounge and gardens.", "Other"],
];
const EX = [
  {
    id: "hike",
    t: "Sunrise hikes",
    d: "Guided walks to the ridge as the mountains turn gold.",
    img: "sunrise-hike",
    more: ["Departs 5:30 am daily", "Guide, flask of tea and snacks included", "Moderate fitness, about 2.5 hours"],
  },
  {
    id: "pool",
    t: "Swimming pool",
    d: "A heated outdoor pool with mountain views, loungers and a poolside bar.",
    img: "pool",
    more: [
      "Open daily 6:00 am – 8:00 pm",
      "Heated adult pool and shallow kids area",
      "Towels, loungers and poolside bar service",
      "Free for all in-house guests; day passes on request",
    ],
  },
  {
    id: "dine",
    t: "Countryside dining",
    d: "Seasonal menus from local farms, served on the terrace.",
    img: "lounge",
    more: ["Breakfast 7–10 am, lunch 12–3 pm, dinner 6:30–9:30 pm", "Vegetarian and special diets welcome"],
  },
  {
    id: "fire",
    t: "Fireside evenings",
    d: "Stone hearths, warm drinks and starlit skies.",
    img: "room-cottage",
    more: ["Every evening from 6 pm in the lounge", "Hot chocolate, Kenyan coffee and nightcaps"],
  },
];
function renderPublic() {
  $("#heroimg").src = img("mashuuru-manor");
  $("#aboutimg").src = img("lounge");
  $("#bookimg").src = img("room-suite");
  $("#nrooms").textContent = S.rooms.reduce((a, r) => a + r.units, 0) || 24;
  $("#roomgrid").innerHTML = S.rooms
    .map(
      (r) =>
        `<article class="room reveal" data-room="${esc(r.id)}"><img src="${img(r.img)}" alt="${esc(r.name)}"><div class="room-body"><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p>${badge(r, search.ci, search.co)}<div class="room-foot"><span><b>${kes(r.price)}</b> / night</span><button class="round" aria-label="View ${esc(r.name)}">&rarr;</button></div></div></article>`,
    )
    .join("");
  $("#pkgs").innerHTML = S.packages
    .map(
      (p) =>
        `<article class="pkg reveal" data-pkg="${esc(p.id)}" style="background-image:url('${img(p.img)}')"><div><h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p><b>${kes(p.price)}</b> <small>/ package · ${p.nights} nights</small></div></article>`,
    )
    .join("");
  $("#amgrid").innerHTML = AM.map(
    (a, i) => `<div class="reveal" data-am="${i}" role="button" tabindex="0">${a[0]}<span>${esc(a[1])}</span></div>`,
  ).join("");
  $("#exps").innerHTML = EX.map(
    (e) =>
      `<button class="exp reveal" data-exp="${e.id}" style="background-image:url('${img(e.img)}')"><div><h3>${e.t}</h3><p>${e.d}</p></div></button>`,
  ).join("");
  $("#staysel").innerHTML =
    '<optgroup label="Rooms">' +
    S.rooms.map((r) => `<option value="r:${esc(r.id)}">${esc(r.name)}</option>`).join("") +
    '</optgroup><optgroup label="Packages">' +
    S.packages.map((p) => `<option value="p:${esc(p.id)}">${esc(p.name)} (${p.nights} nights)</option>`).join("") +
    "</optgroup>";
  checkAvail();
  observe();
}
const closeModal = () => {
  $("#modal").hidden = true;
  $("#modal").innerHTML = "";
};
function show(html, c = "") {
  const m = $("#modal");
  m.className = "modal";
  m.innerHTML = `<div class="panel ${c}"><button class="x" aria-label="Close">&times;</button>${html}</div>`;
  m.hidden = false;
}
function calendar(r) {
  const now = new Date(),
    out = [];
  for (let k = 0; k < 2; k++) {
    const f = new Date(now.getFullYear(), now.getMonth() + k, 1),
      n = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate();
    let h = "<i>M</i><i>T</i><i>W</i><i>T</i><i>F</i><i>S</i><i>S</i>" + "<span></span>".repeat((f.getDay() + 6) % 7);
    for (let d = 1; d <= n; d++) {
      const s = iso(new Date(f.getFullYear(), f.getMonth(), d)),
        fr = freeOn(r, s);
      const c = s < today ? "past" : fr <= 0 ? "full" : fr <= 1 || fr <= r.units * 0.34 ? "few" : "free";
      h += `<b class="${c}" title="${s}: ${fr} of ${r.units} free">${d}</b>`;
    }
    out.push(
      `<div class="cal"><h4>${f.toLocaleString("en", { month: "long", year: "numeric" })}</h4><div class="cg">${h}</div></div>`,
    );
  }
  return `<div class="cals">${out.join("")}</div><div class="legend"><em><s style="background:#dcebd0"></s>Available</em><em><s style="background:#fbe3ad"></s>Limited</em><em><s style="background:#f2c8c2"></s>Booked</em></div>`;
}
function openRoom(id) {
  const r = room(id);
  if (!r) return;
  const g = [r.img, "lounge", "mashuuru-manor"].filter((x, i, a) => a.indexOf(x) === i);
  show(`<div><img class="main" id="mainimg" src="${img(g[0])}" alt="${esc(r.name)}"><div class="thumbs">${g.map((k, i) => `<img src="${img(k)}" data-th="${k}" class="${i ? "" : "on"}" alt="">`).join("")}</div></div>
  <div class="pad"><p class="eyebrow moss">Room details</p><h2 style="margin-top:4px">${esc(r.name)}</h2><p class="price">${kes(r.price)} <small style="font:.9rem var(--sans);color:var(--muted)">/ night · up to ${r.guests} guests</small></p><p class="small" style="color:var(--muted)">${esc(r.desc)}</p>
  <div class="chips">${r.features.map((f) => `<span>${esc(f)}</span>`).join("")}</div>${badge(r, search.ci, search.co)}
  <h4 style="margin:18px 0 4px;font:500 1.2rem var(--display)">Availability</h4>${calendar(r)}
  <button class="btn btn-dark" style="margin-top:16px" data-bookstay="r:${esc(r.id)}">Book this room</button></div>`);
}
function nextStarts(p, limit = 5) {
  const r = room(p.roomId),
    o = [];
  for (let i = 1; i < 90 && o.length < limit; i++) {
    const s = add(today, i);
    if (r && freeRange(r, s, add(s, p.nights)) > 0) o.push(s);
  }
  return o;
}
function openPkg(id) {
  const p = S.packages.find((x) => x.id === id),
    r = room(p.roomId);
  if (!p) return;
  let av;
  if (search.ci && search.co && r) {
    const f = freeRange(r, search.ci, add(search.ci, p.nights));
    av = badge(r, search.ci, add(search.ci, p.nights));
  } else av = '<span class="badge idle">Pick dates in the search bar to check</span>';
  show(`<div><img class="main" src="${img(p.img)}" alt="${esc(p.name)}">${r ? `<div class="thumbs"><img src="${img(r.img)}" alt="${esc(r.name)}" style="width:140px;height:84px"><span class="small" style="align-self:center;color:var(--muted)">Your room: <a href="#" data-room="${esc(r.id)}" style="text-decoration:underline">${esc(r.name)}</a></span></div>` : ""}</div>
  <div class="pad"><p class="eyebrow moss">Exclusive package</p><h2 style="margin-top:4px">${esc(p.name)}</h2><p class="price">${kes(p.price)} <small style="font:.9rem var(--sans);color:var(--muted)">/ package · ${p.nights} nights</small></p><p class="small" style="color:var(--muted)">${esc(p.blurb)}</p>
  <h4 style="margin:16px 0 4px;font:500 1.2rem var(--display)">What is included</h4><ul class="ul">${p.inc.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  <h4 style="margin:16px 0 4px;font:500 1.2rem var(--display)">Availability</h4>${av}
  <p class="small" style="margin-top:10px;color:var(--muted)">Next available start dates: ${
    nextStarts(p)
      .map(
        (d) =>
          `<a href="#" data-start="${d}" data-bookstay="p:${esc(p.id)}" style="text-decoration:underline;margin-right:8px">${new Date(d + "T00:00").toLocaleDateString("en", { day: "numeric", month: "short" })}</a>`,
      )
      .join("") || "none in the next 90 days"
  }</p>
  <button class="btn btn-dark" style="margin-top:16px" data-bookstay="p:${esc(p.id)}">Book this package</button></div>`);
}
function openExp(id) {
  const e = EX.find((x) => x.id === id);
  show(
    `<div><img class="main" src="${img(e.img)}" alt="${e.t}" style="height:100%;min-height:260px"></div><div class="pad"><p class="eyebrow moss">Experience</p><h2 style="margin-top:4px">${e.t}</h2><p class="small" style="color:var(--muted);margin:8px 0">${e.d}</p><ul class="ul">${e.more.map((i) => `<li>${i}</li>`).join("")}</ul><button class="btn btn-dark" style="margin-top:16px" data-bookstay="r:${esc(S.rooms[0]?.id || "")}">Book a stay</button></div>`,
  );
}
function goBook(val, start) {
  closeModal();
  const f = $("#booking-form");
  if (val) f.stay.value = val;
  const ci = start || search.ci;
  if (ci) f.check_in.value = ci;
  if (search.co && !start) f.check_out.value = search.co;
  f.guests.value = search.guests || 2;
  f.promo.value = search.promo || "";
  syncStay();
  $("#book").scrollIntoView({ behavior: "smooth" });
}
function stayInfo() {
  const f = $("#booking-form"),
    [k, id] = f.stay.value.split(":");
  if (k === "p") {
    const p = S.packages.find((x) => x.id === id);
    return { pkg: p, room: p && room(p.roomId) };
  }
  return { room: room(id) };
}
function syncStay() {
  const f = $("#booking-form"),
    s = stayInfo();
  if (s.pkg) {
    f.check_out.disabled = true;
    if (f.check_in.value) f.check_out.value = add(f.check_in.value, s.pkg.nights);
  } else {
    f.check_out.disabled = false;
    if (f.check_out.value && f.check_out.value <= f.check_in.value) f.check_out.value = "";
  }
  checkAvail();
}
function checkAvail() {
  const f = $("#booking-form"),
    s = stayInfo(),
    el = $("#avail");
  if (!s.room || !f.check_in.value || !f.check_out.value || f.check_out.value <= f.check_in.value) {
    el.textContent = "";
    return;
  }
  const n = freeRange(s.room, f.check_in.value, f.check_out.value);
  el.textContent =
    n > 0
      ? `✓ ${n} ${n === 1 ? "room" : "rooms"} available for these dates.`
      : "✕ Fully booked for these dates — please try other dates.";
}

/* ---------- events (public) ---------- */
document.addEventListener("click", (e) => {
  const t = e.target;
  let a;
  if (t.closest(".x") || t === $("#modal")) {
    closeModal();
    return;
  }
  if ((a = t.closest("[data-go]"))) {
    e.preventDefault();
    const id = a.dataset.go;
    (id === "top" ? document.documentElement : document.getElementById(id)).scrollIntoView({ behavior: "smooth" });
    $(".nav").classList.remove("open");
    return;
  }
  if ((a = t.closest("[data-bookstay]"))) {
    e.preventDefault();
    goBook(a.dataset.bookstay, a.dataset.start);
    return;
  }
  if ((a = t.closest("[data-th]"))) {
    $("#mainimg").src = img(a.dataset.th);
    $$(".thumbs img").forEach((i) => i.classList.toggle("on", i === a));
    return;
  }
  if ((a = t.closest("[data-room]"))) {
    e.preventDefault();
    openRoom(a.dataset.room);
    return;
  }
  if ((a = t.closest("[data-pkg]"))) {
    openPkg(a.dataset.pkg);
    return;
  }
  if ((a = t.closest("[data-exp]"))) {
    openExp(a.dataset.exp);
    return;
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
$$(".menu-toggle").forEach(
  (b) =>
    (b.onclick = () => b.setAttribute("aria-expanded", b.parentElement.querySelector(".nav").classList.toggle("open"))),
);
$("#year").textContent = new Date().getFullYear();
$$("input[type=date]").forEach((i) => (i.min = today));
$("#search").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  if (!f.ci.value || !f.co.value) return toast("Please choose your check-in and check-out dates.");
  if (f.co.value <= f.ci.value) return toast("Check-out must be after check-in.");
  search = { ci: f.ci.value, co: f.co.value, guests: +f.guests.value || 2, promo: f.promo.value };
  renderPublic();
  const n = S.rooms.filter((r) => freeRange(r, search.ci, search.co) > 0).length;
  $("#searchnote").textContent =
    `${n} of ${S.rooms.length} accommodation types available for ${search.ci} to ${search.co}. Tap a room to see photos and its calendar.`;
  $("#rooms").scrollIntoView({ behavior: "smooth" });
});
const form = $("#booking-form");
form.stay.onchange = syncStay;
form.check_in.onchange = syncStay;
form.check_out.onchange = checkAvail;
const status = (t, ok) => {
  const s = $("#form-status");
  s.textContent = t;
  s.className = "full status " + (ok ? "ok" : "err");
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form).entries());
  if (d.website) return;
  const s = stayInfo(),
    ci = d.check_in,
    co = s.pkg ? add(ci || today, s.pkg.nights) : d.check_out;
  if (d.full_name.trim().length < 2) return status("Please enter your full name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return status("Please enter a valid email.");
  if (!ci || !co) return status("Please choose your dates.");
  if (co <= ci) return status("Check-out must be after check-in.");
  if (ci < today) return status("Check-in cannot be in the past.");
  const g = +d.guests;
  if (!(g >= 1 && g <= 12)) return status("Guests must be between 1 and 12.");
  if (!s.room) return status("Please choose a room or package.");
  if (g > s.room.guests) return status(`${s.room.name} sleeps up to ${s.room.guests} guests.`);
  if (freeRange(s.room, ci, co) <= 0) return status("Sorry, that stay is fully booked for those dates.");
  const btn = form.querySelector("button[type=submit],button:not([type])");
  if (btn) btn.disabled = true;
  status("Sending your request…", true);
  api({
    action: "book",
    name: d.full_name.trim(),
    email: d.email.trim(),
    phone: d.phone.trim(),
    check_in: ci,
    check_out: co,
    guests: g,
    roomId: s.room.id,
    pkgId: s.pkg?.id || "",
    promo: d.promo || "",
    message: d.message.trim(),
    website: d.website || "",
  }).then((r) => {
    if (btn) btn.disabled = false;
    if (r && r.ok) {
      form.reset();
      adopt(r.state);
      renderPublic();
      syncStay();
      status(`Thank you! Reference ${r.ref} (${kes(r.total)}). Our team will confirm within 24 hours.`, true);
    } else {
      if (r && r.state) {
        adopt(r.state);
        renderPublic();
        checkAvail();
      }
      status((r && r.error) || "We could not send your request. Please WhatsApp or call us.");
    }
  });
});

/* ---------- date picker (own calendar, works in every browser) ---------- */
const MN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DP = { inp: null, m: null };
const grpEl = (g, r) => $(`[data-dp="${g}"][data-role="${r}"]`);
const fire = (i) => i.dispatchEvent(new Event("change", { bubbles: true }));
function dpOpen(inp) {
  const ci = grpEl(inp.dataset.dp, "ci").value;
  DP.inp = inp;
  const b = inp.value || (inp.dataset.role === "co" && ci ? add(ci, 1) : today);
  DP.m = pd(b < today ? today : b);
  DP.m.setDate(1);
  dpDraw();
}
function dpClose() {
  const m = $("#dpm");
  m.hidden = true;
  m.innerHTML = "";
}
function dpDraw() {
  const inp = DP.inp,
    g = inp.dataset.dp,
    role = inp.dataset.role,
    ci = grpEl(g, "ci").value,
    co = grpEl(g, "co").value,
    rm = g === "book" ? stayInfo().room : null,
    n2 = innerWidth > 760 ? 2 : 1;
  let mh = "";
  for (let k = 0; k < n2; k++) {
    const f = new Date(DP.m.getFullYear(), DP.m.getMonth() + k, 1),
      dim = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate();
    let h =
      ["M", "T", "W", "T", "F", "S", "S"].map((x) => `<i>${x}</i>`).join("") +
      "<span></span>".repeat((f.getDay() + 6) % 7);
    for (let d = 1; d <= dim; d++) {
      const s = iso(new Date(f.getFullYear(), f.getMonth(), d)),
        full = rm && freeOn(rm, s) <= 0,
        dis = s < today || (role === "co" && ci && s <= ci) || (full && role === "ci");
      h += `<button type="button" class="d${s === ci || s === co ? " sel" : ""}${ci && co && s > ci && s < co ? " rng" : ""}${full ? " full" : ""}" data-d="${s}"${dis ? " disabled" : ""}>${d}</button>`;
    }
    mh += `<div class="dpm"><h4>${MN[f.getMonth()]} ${f.getFullYear()}</h4><div class="cg dg">${h}</div></div>`;
  }
  const m = $("#dpm");
  m.className = "modal";
  m.hidden = false;
  m.innerHTML = `<div class="panel one dpp"><button class="x" aria-label="Close">&times;</button><div class="pad"><p class="eyebrow moss">${role === "ci" ? "Select your check-in date" : "Select your check-out date"}</p><div class="dpnav"><button type="button" class="round" data-dpn="-1" aria-label="Previous month">&larr;</button><span class="small" style="color:var(--muted)">${rm ? "Crossed-out dates are fully booked" : "Tap a date"}</span><button type="button" class="round" data-dpn="1" aria-label="Next month">&rarr;</button></div><div class="dpms">${mh}</div></div></div>`;
}
document.addEventListener("click", (e) => {
  const t = e.target;
  let a;
  if (t.closest("#dpm")) {
    if (t.closest(".x") || t === $("#dpm")) {
      dpClose();
      return;
    }
    if ((a = t.closest("[data-dpn]"))) {
      const n = new Date(DP.m.getFullYear(), DP.m.getMonth() + +a.dataset.dpn, 1),
        c = pd(today);
      if (n >= new Date(c.getFullYear(), c.getMonth(), 1)) {
        DP.m = n;
        dpDraw();
      }
      return;
    }
    if ((a = t.closest("[data-d]"))) {
      const s = a.dataset.d,
        inp = DP.inp,
        g = inp.dataset.dp,
        ci = grpEl(g, "ci"),
        co = grpEl(g, "co");
      inp.value = s;
      fire(inp);
      if (inp.dataset.role === "ci") {
        if (co.value && co.value <= s) {
          co.value = "";
          fire(co);
        }
        if (!co.disabled) {
          DP.inp = co;
          DP.m = pd(add(s, 1));
          DP.m.setDate(1);
          dpDraw();
          return;
        }
      }
      dpClose();
    }
    return;
  }
  if ((a = t.closest("[data-dp]"))) {
    e.preventDefault();
    dpOpen(a);
    return;
  }
  if ((a = t.closest("[data-home]"))) {
    e.preventDefault();
    goHome(a.dataset.home);
    $$(".nav").forEach((n) => n.classList.remove("open"));
    return;
  }
  if ((a = t.closest("[data-fd]"))) {
    e.preventDefault();
    openFD(a.dataset.topic || "");
    return;
  }
  if ((a = t.closest("[data-cart]"))) {
    e.preventDefault();
    openCart();
    return;
  }
  if ((a = t.closest("[data-add]"))) {
    const x = mi(a.dataset.add);
    cart[x.id] = (cart[x.id] || 0) + 1;
    toast(x.n + " added to your order");
    $("#cartn").textContent = cartN();
    if (!$("#modal").hidden) closeModal();
    return;
  }
  if ((a = t.closest("[data-q]"))) {
    const [id, d] = a.dataset.q.split("|");
    cart[id] = (cart[id] || 0) + +d;
    if (cart[id] <= 0) delete cart[id];
    $("#cartn").textContent = cartN();
    cartN() ? openCart() : closeModal();
    return;
  }
  if ((a = t.closest("[data-mi]"))) {
    openMi(a.dataset.mi);
    return;
  }
  if ((a = t.closest("[data-mcat]"))) {
    mcat = a.dataset.mcat;
    renderMenu();
    return;
  }
  if ((a = t.closest("[data-mdiet]"))) {
    const d = a.dataset.mdiet;
    mdiet = mdiet.includes(d) ? mdiet.filter((x) => x !== d) : [...mdiet, d];
    renderMenu();
    return;
  }
  if ((a = t.closest("[data-am]"))) {
    openAm(+a.dataset.am);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    dpClose();
    closeModal();
  }
  if (e.key === "Enter" && e.target.matches("[role=button],[data-dp]")) e.target.click();
});

/* ---------- menu & food ---------- */
const MENU = [
  [
    "b1",
    "Breakfast",
    "Manor Full Breakfast",
    "Eggs your way, farm sausage, bacon, grilled tomato, beans and toast.",
    1450,
    "🍳",
    [],
  ],
  ["b2", "Breakfast", "Mandazi &amp; Spiced Chai", "Warm cardamom mandazi with Kenyan masala tea.", 650, "🫖", ["V"]],
  [
    "b3",
    "Breakfast",
    "Avocado &amp; Poached Eggs",
    "Sourdough, smashed avocado, poached eggs and chilli oil.",
    1200,
    "🥑",
    ["V", "S"],
  ],
  [
    "b4",
    "Breakfast",
    "Farm Fruit &amp; Yoghurt Bowl",
    "Seasonal fruit, honey, granola and thick local yoghurt.",
    900,
    "🍓",
    ["V", "GF"],
  ],
  ["b5", "Breakfast", "Honey Pancakes", "Fluffy stacks with wild honey and berries.", 950, "🥞", ["V"]],
  [
    "l1",
    "Lunch",
    "Nyama Choma Platter",
    "Charcoal-grilled goat or beef with kachumbari and ugali.",
    2400,
    "🍖",
    ["GF"],
  ],
  ["l2", "Lunch", "Grilled Tilapia &amp; Ugali", "Whole tilapia, coconut greens and fresh ugali.", 1900, "🐟", ["GF"]],
  ["l3", "Lunch", "Chicken Caesar Wrap", "Grilled chicken, parmesan, cos lettuce and house dressing.", 1300, "🌯", []],
  [
    "l4",
    "Lunch",
    "Garden Vegetable Curry",
    "Seasonal vegetables in a mild coconut curry with rice.",
    1400,
    "🥗",
    ["V", "S"],
  ],
  ["l5", "Lunch", "Manor Beef Burger", "Local beef, cheddar, caramelised onion, hand-cut fries.", 1600, "🍔", []],
  ["d1", "Dinner", "Slow-roast Lamb Shank", "Rosemary jus, creamy mash and buttered greens.", 3200, "🍖", ["GF"]],
  ["d2", "Dinner", "Pan-seared Salmon", "Lemon butter, asparagus and roasted baby potatoes.", 3000, "🐟", ["GF"]],
  ["d3", "Dinner", "Pilau &amp; Kachumbari", "Fragrant spiced rice with slow-cooked beef.", 1700, "🍚", ["S"]],
  [
    "d4",
    "Dinner",
    "Wild Mushroom Risotto",
    "Creamy arborio rice, forest mushrooms and parmesan.",
    2100,
    "🍄",
    ["V", "GF"],
  ],
  ["d5", "Dinner", "Ribeye Steak", "300g ribeye, peppercorn sauce and garden salad.", 3600, "🥩", ["GF"]],
  ["s1", "Desserts", "Passion Fruit Cheesecake", "Baked cheesecake with fresh passion fruit coulis.", 850, "🍰", ["V"]],
  ["s2", "Desserts", "Chocolate Fondant", "Warm molten centre with vanilla ice cream.", 900, "🍫", ["V"]],
  [
    "s3",
    "Desserts",
    "Seasonal Fruit Platter",
    "Sliced fruit from the farm with lime and mint.",
    700,
    "🍉",
    ["V", "GF"],
  ],
  ["k1", "Drinks", "Kenyan Coffee", "Single-origin, brewed to order.", 400, "☕", ["V"]],
  ["k2", "Drinks", "Dawa Cocktail", "Vodka, honey, lime and crushed ice.", 750, "🍹", []],
  ["k3", "Drinks", "Fresh Passion Juice", "Pressed daily, no added sugar.", 450, "🧃", ["V", "GF"]],
  ["k4", "Drinks", "Wine by the Glass", "Ask for today red or white selection.", 900, "🍷", []],
  ["k5", "Drinks", "Tusker Lager", "Ice-cold 500ml bottle.", 500, "🍺", []],
].map((a) => ({ id: a[0], c: a[1], n: a[2], d: a[3], p: a[4], e: a[5], t: a[6] }));
const CATS = ["Breakfast", "Lunch", "Dinner", "Desserts", "Drinks"],
  TAG = { V: "Vegetarian", GF: "Gluten-free", S: "Spicy" };
let mcat = "All",
  mdiet = [],
  cart = {};
const mi = (id) => MENU.find((x) => x.id === id),
  cartN = () => Object.values(cart).reduce((a, b) => a + b, 0);
const dec = (s) => s.replace(/&amp;/g, "&");
const tags = (x) => x.t.map((t) => `<span class="tg">${TAG[t]}</span>`).join("");
function renderMenu() {
  $("#mtabs").innerHTML = ["All", ...CATS]
    .map((c) => `<button data-mcat="${c}" class="${mcat === c ? "on" : ""}">${c}</button>`)
    .join("");
  $("#mchips").innerHTML = Object.keys(TAG)
    .map(
      (k) =>
        `<span data-mdiet="${k}" class="${mdiet.includes(k) ? "on" : ""}" role="button" tabindex="0">${TAG[k]}</span>`,
    )
    .join("");
  const it = MENU.filter((x) => (mcat === "All" || x.c === mcat) && mdiet.every((d) => x.t.includes(d)));
  $("#mgrid").innerHTML =
    it
      .map(
        (x) =>
          `<article class="mi reveal" data-mi="${x.id}"><div class="me">${x.e}</div><div class="mb"><h3>${x.n}</h3><p>${x.d}</p>${tags(x)}<div class="mf"><b>${kes(x.p)}</b><button class="round" data-add="${x.id}" aria-label="Add to order">+</button></div></div></article>`,
      )
      .join("") || "<p>No dishes match those filters.</p>";
  $("#cartn").textContent = cartN();
  observe();
}
function openMi(id) {
  const x = mi(id);
  show(
    `<div class="pad" style="text-align:center"><div style="font-size:5rem">${x.e}</div><p class="eyebrow moss">${x.c}</p><h2 style="margin-top:4px">${x.n}</h2><p class="small" style="color:var(--muted);margin:10px 0">${x.d}</p><div>${tags(x)}</div><p class="price">${kes(x.p)}</p><button class="btn btn-dark" data-add="${x.id}">Add to my order</button></div>`,
    "one",
  );
}
function openCart() {
  const ids = Object.keys(cart);
  if (!ids.length) {
    show(
      '<div class="pad" style="text-align:center"><div style="font-size:3rem">🍽️</div><h2>Your order is empty</h2><p class="small" style="color:var(--muted);margin-top:8px">Tap + on any dish to add it.</p></div>',
      "one",
    );
    return;
  }
  const tot = ids.reduce((a, i) => a + mi(i).p * cart[i], 0);
  show(
    `<div class="pad"><p class="eyebrow moss">Room service &amp; dining</p><h2 style="margin-top:4px">Your order</h2>${ids.map((i) => `<div class="qrow"><span>${mi(i).n}</span><div><button class="round" data-q="${i}|-1">−</button>${cart[i]}<button class="round" data-q="${i}|1">+</button><b style="min-width:92px;text-align:right">${kes(mi(i).p * cart[i])}</b></div></div>`).join("")}<p class="price" style="text-align:right">Total ${kes(tot)}</p>
  <form id="orderform" class="of"><input name="name" placeholder="Your name" required><input name="where" placeholder="Room number or table" required><textarea name="msg" rows="2" placeholder="Allergies or special requests (optional)"></textarea><button class="btn btn-dark">Send order to the kitchen</button></form></div>`,
    "one",
  );
}

/* ---------- front desk & amenities ---------- */
function openFD(topic = "") {
  show(
    `<div class="pad"><p class="eyebrow moss">Front desk · open 24 hours</p><h2 style="margin-top:4px">How can we help?</h2><p class="small" style="color:var(--muted);margin:8px 0 16px">Call, message, or leave a request and our team will respond within minutes.</p>
  <div class="fdacts"><a class="btn btn-dark" href="tel:+254700000000">📞 Call</a><a class="btn btn-dark" href="https://wa.me/254700000000" target="_blank" rel="noopener">💬 WhatsApp</a><a class="btn btn-dark" href="mailto:stay@mashuurumanor.com">✉️ Email</a></div>
  <form id="fdform" class="fdf"><input name="name" placeholder="Your name" required><input name="where" placeholder="Room number or phone"><select name="topic">${["Reservation or booking", "Room service", "Airport transfer", "Housekeeping", "Spa & wellness", "Pool & activities", "Other"].map((t) => `<option ${t === topic ? "selected" : ""}>${esc(t)}</option>`).join("")}</select><textarea name="msg" rows="3" placeholder="How can we help?" required></textarea><button class="btn btn-dark">Send to front desk</button></form></div>`,
    "one",
  );
}
function openAm(i) {
  const a = AM[i];
  show(
    `<div class="pad" style="text-align:center"><div style="font-size:4rem">${a[0]}</div><h2>${a[1]}</h2><p class="small" style="color:var(--muted);margin:10px 0 18px">${a[2]}</p><button class="btn btn-dark" data-fd data-topic="${esc(a[3] || "Other")}">Ask the front desk</button></div>`,
    "one",
  );
}
document.addEventListener("submit", (e) => {
  const f = e.target;
  if (f.id === "fdform") {
    e.preventDefault();
    api({
      action: "request",
      type: "Front desk · " + f.topic.value,
      name: f.name.value,
      where: f.where.value,
      msg: f.msg.value,
      website: f.website ? f.website.value : "",
    }).then((r) =>
      toast(
        r && r.ok
          ? "Message sent — the front desk will contact you shortly."
          : "Could not send — please call or WhatsApp us.",
      ),
    );
    closeModal();
  }
  if (f.id === "orderform") {
    e.preventDefault();
    const ids = Object.keys(cart);
    api({
      action: "request",
      type: "Food order",
      name: f.name.value,
      where: f.where.value,
      msg: f.msg.value,
      items: ids.map((i) => cart[i] + " × " + dec(mi(i).n)),
      total: ids.reduce((a, i) => a + mi(i).p * cart[i], 0),
    }).then((r) =>
      toast(r && r.ok ? "Order sent to the kitchen. Thank you!" : "Could not send — please call the front desk."),
    );
    cart = {};
    closeModal();
    renderMenu();
  }
});
let pend = null;
function flush() {
  if (!pend) return;
  const id = pend;
  pend = null;
  setTimeout(
    () =>
      (id === "top" ? document.documentElement : document.getElementById(id))?.scrollIntoView({ behavior: "smooth" }),
    60,
  );
}
function goHome(id) {
  pend = id;
  if (location.hash) location.hash = "";
  else flush();
}

/* ---------- staff panel ---------- */
document.addEventListener("change", (e) => {
  const x = e.target;
  if (x.dataset.rq) {
    S.requests.find((r) => r.id === x.dataset.rq).status = x.value;
    save();
    renderAdmin();
  }
});
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-delq]");
  if (a && confirm("Delete this entry?")) {
    S.requests = S.requests.filter((r) => r.id !== a.dataset.delq);
    save();
    renderAdmin();
  }
});
const A = "mm_admin_ok";
let tab = "bookings",
  flt = { s: "all", q: "" };
const isAdmin = () => {
  try {
    return sessionStorage.getItem(A) === "1";
  } catch (e) {
    return window.__a === 1;
  }
};
const setAdmin = (v) => {
  window.__a = v ? 1 : 0;
  try {
    v ? sessionStorage.setItem(A, "1") : sessionStorage.removeItem(A);
  } catch (e) {}
};
const stayName = (b) =>
  (b.pkgId ? (S.packages.find((p) => p.id === b.pkgId)?.name || "Package") + " · " : "") +
  (room(b.roomId)?.name || "Removed room");
function renderAdmin() {
  const el = $("#admin");
  if (!isAdmin()) {
    el.innerHTML = `<form class="login" id="alogin"><h2 style="font:500 1.8rem var(--display)">Staff login</h2><p class="small" style="color:var(--muted)">Mashuuru Manor team only.</p><p class="err" id="aerr"></p><input name="u" placeholder="Username" autocomplete="username" required><input name="p" type="password" placeholder="Password" autocomplete="current-password" required><button class="abtn">Log in</button><a href="#" class="small" id="aback" style="text-align:center;color:var(--primary)">← Back to website</a></form>`;
    return;
  }
  S = load();
  const bk = S.bookings,
    act = bk.filter((b) => b.status !== "cancelled");
  const tot = S.rooms.reduce((a, r) => a + r.units, 0),
    inn = act.filter((b) => b.ci <= today && today < b.co).length;
  const head = `<div class="a-top"><strong style="font:500 1.4rem var(--display)">Mashuuru Manor — Staff panel</strong><div class="tabs">${[
    ["bookings", "Bookings"],
    ["acc", "Accommodations"],
    [
      "desk",
      "Front desk" +
        (S.requests.filter((r) => r.status === "new").length
          ? " (" + S.requests.filter((r) => r.status === "new").length + ")"
          : ""),
    ],
    ["avail", "Availability"],
  ]
    .map((t) => `<button data-tab="${t[0]}" class="${tab === t[0] ? "on" : ""}">${t[1]}</button>`)
    .join("")}</div><div><a href="#" id="aback">View website</a> · <button id="alogout">Log out</button></div></div>`;
  let body = "";
  if (tab === "bookings") {
    const rows = bk.filter(
      (b) =>
        (flt.s === "all" || b.status === flt.s) &&
        (!flt.q || (b.name + b.email + b.ref + stayName(b)).toLowerCase().includes(flt.q.toLowerCase())),
    );
    body = `<div class="cards"><div class="stat"><b>${bk.filter((b) => b.status === "new").length}</b><span>New requests</span></div><div class="stat"><b>${bk.filter((b) => b.status === "confirmed").length}</b><span>Confirmed</span></div><div class="stat"><b>${inn}/${tot}</b><span>Rooms in use today</span></div><div class="stat"><b>${kes(bk.filter((b) => b.status === "confirmed").reduce((a, b) => a + b.total, 0))}</b><span>Confirmed revenue</span></div></div>
    <div class="row"><label>Status<select id="fs">${["all", "new", "confirmed", "cancelled"].map((s) => `<option ${flt.s === s ? "selected" : ""}>${s}</option>`).join("")}</select></label><label>Search<input id="fq" value="${esc(flt.q)}" placeholder="Name, email, ref"></label></div>
    <details class="acard"><summary style="cursor:pointer">+ Add walk-in / phone booking</summary><form id="walkin" class="row" style="margin-top:12px"><label>Guest<input name="n" required></label><label>Phone<input name="ph"></label><label>Room<select name="r">${S.rooms.map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join("")}</select></label><label>Check in<input type="date" name="a" min="${today}" required></label><label>Check out<input type="date" name="b" required></label><label>Guests<input type="number" name="g" value="2" min="1" max="12" style="width:70px"></label><button class="abtn">Add as confirmed</button></form></details>
    <div class="tw"><table><tr><th>Ref</th><th>Guest</th><th>Stay</th><th>Dates</th><th>Guests</th><th>Total</th><th>Status</th><th></th></tr>${rows.map((b) => `<tr><td>${esc(b.ref)}<br><small style="color:var(--muted)">${new Date(b.created).toLocaleDateString("en")}</small></td><td>${esc(b.name)}<br><a href="mailto:${esc(b.email)}">${esc(b.email)}</a><br>${esc(b.phone)}${b.msg ? `<br><small>“${esc(b.msg)}”</small>` : ""}</td><td>${esc(stayName(b))}</td><td>${b.ci} → ${b.co}<br><small>${nights(b.ci, b.co)} nights</small></td><td>${b.guests}</td><td>${kes(b.total)}</td><td><select data-st="${esc(b.id)}">${["new", "confirmed", "cancelled"].map((s) => `<option ${b.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td><td><button class="abtn del" data-delb="${esc(b.id)}">Delete</button></td></tr>`).join("") || '<tr><td colspan="8">No bookings match.</td></tr>'}</table></div>`;
  }
  if (tab === "acc") {
    body =
      `<h3 style="margin-bottom:12px">Rooms &amp; suites</h3>` +
      S.rooms
        .map(
          (
            r,
          ) => `<form class="acard" data-room-form="${esc(r.id)}"><h4>${esc(r.name)}</h4><div class="row"><label>Name<input name="name" value="${esc(r.name)}"></label><label>Price / night (KES)<input name="price" type="number" min="0" value="${r.price}"></label><label>Units<input name="units" type="number" min="0" value="${r.units}" style="width:80px"></label><label>Max guests<input name="guests" type="number" min="1" value="${r.guests}" style="width:80px"></label><label>Photo<select name="img">${Object.keys(
            IMG,
          )
            .map((k) => `<option ${r.img === k ? "selected" : ""}>${k}</option>`)
            .join(
              "",
            )}</select></label></div><div class="row"><label style="flex:1">Description<input name="desc" value="${esc(r.desc)}" style="width:100%"></label><label style="flex:1">Features (comma separated)<input name="features" value="${esc(r.features.join(", "))}" style="width:100%"></label></div>
    <div class="row"><label style="grid-auto-flow:column;align-items:center;text-transform:none;letter-spacing:0"><input type="checkbox" name="closed" ${r.closed ? "checked" : ""}> Not bookable (closed)</label><button class="abtn">Save</button><button type="button" class="abtn del" data-delr="${esc(r.id)}">Delete</button></div>
    <div class="row"><label>Block a date<input type="date" data-blk="${esc(r.id)}" min="${today}"></label><button type="button" class="abtn alt" data-addblk="${esc(r.id)}">Block</button>${r.blocked
      .sort()
      .map((d) => `<span class="pill">${d} <a href="#" data-unblk="${esc(r.id)}|${d}">×</a></span>`)
      .join("")}</div></form>`,
        )
        .join("") +
      `<details class="acard"><summary style="cursor:pointer">+ Add accommodation</summary><form id="newroom" class="row" style="margin-top:12px"><label>Name<input name="name" required></label><label>Price<input name="price" type="number" required></label><label>Units<input name="units" type="number" value="1" style="width:80px"></label><label>Guests<input name="guests" type="number" value="2" style="width:80px"></label><label>Description<input name="desc"></label><button class="abtn">Add</button></form></details>
    <h3 style="margin:24px 0 12px">Packages</h3>` +
      S.packages
        .map(
          (p) =>
            `<form class="acard" data-pkg-form="${esc(p.id)}"><div class="row"><label>Name<input name="name" value="${esc(p.name)}"></label><label>Price (KES)<input name="price" type="number" value="${p.price}"></label><label>Nights<input name="nights" type="number" min="1" value="${p.nights}" style="width:80px"></label><label>Room<select name="roomId">${S.rooms.map((r) => `<option value="${esc(r.id)}" ${p.roomId === r.id ? "selected" : ""}>${esc(r.name)}</option>`).join("")}</select></label></div><div class="row"><label style="flex:1">Blurb<input name="blurb" value="${esc(p.blurb)}" style="width:100%"></label><label style="flex:1">Inclusions (comma separated)<input name="inc" value="${esc(p.inc.join(", "))}" style="width:100%"></label><button class="abtn">Save</button></div></form>`,
        )
        .join("");
  }
  if (tab === "desk") {
    body = `<div class="tw"><table><tr><th>Received</th><th>Type</th><th>From</th><th>Details</th><th>Status</th><th></th></tr>${S.requests.map((r) => `<tr><td>${new Date(r.created).toLocaleString("en")}</td><td>${esc(r.type)}</td><td>${esc(r.name)}<br>${esc(r.where)}</td><td>${r.items ? r.items.map(esc).join("<br>") + "<br><b>" + kes(r.total) + "</b><br>" : ""}${esc(r.msg)}</td><td><select data-rq="${esc(r.id)}">${["new", "done"].map((s) => `<option ${r.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td><td><button class="abtn del" data-delq="${esc(r.id)}">Delete</button></td></tr>`).join("") || '<tr><td colspan="6">No front desk messages or food orders yet.</td></tr>'}</table></div>`;
  }
  if (tab === "avail") {
    const ds = Array.from({ length: 14 }, (_, i) => add(today, i));
    body = `<p class="small" style="color:var(--muted);margin-bottom:12px">Free units per night for the next 14 days (0 = fully booked or blocked).</p><div class="tw" style="padding:12px"><div class="grid" style="grid-template-columns:160px repeat(14,minmax(38px,1fr));min-width:760px"><div class="h"></div>${ds.map((d) => `<div class="h">${d.slice(5)}</div>`).join("")}${S.rooms
      .map(
        (r) =>
          `<div style="text-align:left">${esc(r.name)}</div>` +
          ds
            .map((d) => {
              const f = freeOn(r, d);
              return `<div style="background:${f <= 0 ? "#f2c8c2" : f <= 1 ? "#fbe3ad" : "#dcebd0"};color:#222">${f}</div>`;
            })
            .join(""),
      )
      .join("")}</div></div>`;
  }
  el.innerHTML = head + `<div class="a-main">${body}</div>`;
}
document.addEventListener("submit", (e) => {
  const f = e.target;
  if (f.id === "alogin") {
    e.preventDefault();
    api({ action: "login", u: f.u.value, p: f.p.value }).then((r) => {
      if (r && r.ok) {
        setAdmin(true);
        refresh().then(renderAdmin);
      } else $("#aerr").textContent = (r && r.error) || "Wrong username or password.";
    });
    return;
  }
  if (f.id === "walkin") {
    e.preventDefault();
    const r = room(f.r.value);
    if (f.b.value <= f.a.value) return toast("Check-out must be after check-in.");
    if (freeRange(r, f.a.value, f.b.value) <= 0) return toast("No availability for those dates.");
    S.bookings.unshift({
      id: "b" + Date.now(),
      ref: "MM-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      name: f.n.value,
      email: "",
      phone: f.ph.value,
      ci: f.a.value,
      co: f.b.value,
      guests: +f.g.value,
      roomId: r.id,
      pkgId: "",
      msg: "Walk-in / phone booking",
      status: "confirmed",
      total: nights(f.a.value, f.b.value) * r.price,
      created: Date.now(),
    });
    save();
    renderAdmin();
    return;
  }
  if (f.dataset.roomForm) {
    e.preventDefault();
    const r = room(f.dataset.roomForm);
    Object.assign(r, {
      name: f.name.value,
      price: +f.price.value,
      units: +f.units.value,
      guests: +f.guests.value,
      img: f.img.value,
      desc: f.desc.value,
      features: f.features.value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      closed: f.closed.checked,
    });
    save();
    renderAdmin();
    toast("Accommodation saved");
    return;
  }
  if (f.dataset.pkgForm) {
    e.preventDefault();
    const p = S.packages.find((x) => x.id === f.dataset.pkgForm);
    Object.assign(p, {
      name: f.name.value,
      price: +f.price.value,
      nights: Math.max(1, +f.nights.value),
      roomId: f.roomId.value,
      blurb: f.blurb.value,
      inc: f.inc.value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    save();
    renderAdmin();
    toast("Package saved");
    return;
  }
  if (f.id === "newroom") {
    e.preventDefault();
    S.rooms.push({
      id: "r" + Date.now(),
      name: f.name.value,
      desc: f.desc.value || "New accommodation",
      price: +f.price.value,
      units: +f.units.value || 1,
      guests: +f.guests.value || 2,
      img: "room-deluxe",
      features: ["Free Wi-Fi"],
      closed: false,
      blocked: [],
    });
    save();
    renderAdmin();
    toast("Accommodation added");
  }
});
document.addEventListener("click", (e) => {
  const t = e.target;
  let a;
  if (t.closest("#aback")) {
    e.preventDefault();
    location.hash = "";
    return;
  }
  if (t.id === "alogout") {
    api({ action: "logout" });
    setAdmin(false);
    renderAdmin();
    return;
  }
  if ((a = t.closest("[data-tab]"))) {
    tab = a.dataset.tab;
    renderAdmin();
    return;
  }
  if ((a = t.closest("[data-delb]"))) {
    if (confirm("Delete this booking permanently?")) {
      S.bookings = S.bookings.filter((b) => b.id !== a.dataset.delb);
      save();
      renderAdmin();
    }
    return;
  }
  if ((a = t.closest("[data-delr]"))) {
    const id = a.dataset.delr;
    if (S.bookings.some((b) => b.roomId === id && b.status !== "cancelled" && b.co > today))
      return toast("Room has upcoming bookings — cancel them first.");
    if (confirm("Delete this accommodation?")) {
      S.rooms = S.rooms.filter((r) => r.id !== id);
      S.packages = S.packages.filter((p) => p.roomId !== id);
      save();
      renderAdmin();
    }
    return;
  }
  if ((a = t.closest("[data-addblk]"))) {
    const id = a.dataset.addblk,
      v = $(`[data-blk="${id}"]`).value;
    if (v) {
      const r = room(id);
      if (!r.blocked.includes(v)) r.blocked.push(v);
      save();
      renderAdmin();
    }
    return;
  }
  if ((a = t.closest("[data-unblk]"))) {
    e.preventDefault();
    const [id, d] = a.dataset.unblk.split("|"),
      r = room(id);
    r.blocked = r.blocked.filter((x) => x !== d);
    save();
    renderAdmin();
  }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.st) {
    const b = S.bookings.find((x) => x.id === t.dataset.st),
      r = room(b.roomId);
    if (t.value !== "cancelled" && b.status === "cancelled" && r && freeRange(r, b.ci, b.co, b.id) <= 0) {
      toast("No availability left for those dates.");
      renderAdmin();
      return;
    }
    b.status = t.value;
    save();
    renderAdmin();
  }
  if (t.id === "fs") {
    flt.s = t.value;
    renderAdmin();
  }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "fq") {
    flt.q = e.target.value;
    const p = e.target.selectionStart;
    renderAdmin();
    const q = $("#fq");
    q.focus();
    q.setSelectionRange(p, p);
  }
});

/* ---------- router ---------- */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((x) => {
      if (x.isIntersecting) {
        x.target.classList.add("visible");
        io.unobserve(x.target);
      }
    }),
  { threshold: 0.1 },
);
function observe() {
  $$(".reveal:not(.visible)").forEach((x) => io.observe(x));
}
function route() {
  const h = location.hash,
    a = h === "#admin",
    m = h === "#menu";
  $("#site").hidden = a || m;
  $("#menupage").hidden = !m;
  $("#admin").hidden = !a;
  $("#fab").hidden = a;
  closeModal();
  dpClose();
  if (a) renderAdmin();
  else if (m) renderMenu();
  else renderPublic();
  window.scrollTo(0, 0);
  flush();
}
addEventListener("hashchange", route);
route();
refresh().then((ok) => {
  if (ok) route();
});
