const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr9OC_eu2h6pueqFjPVv01aKW10WNLWLU-iSdUDKgmR9yO_iyIAWW0o3eu7Ms9dSV2G3ShUxuBvR_N/pub?gid=0&single=true&output=csv";
const LOCAL_GIGS_URL = "./data/gigs.json";

function parseCsv(csv) {
  const rows = csv
    .split(/\r?\n/)
    .map((row) => row.split(","))
    .filter((row) => row.some((cell) => cell && cell.trim() !== ""));

  if (rows.length === 0) {
    return [];
  }

  const headers = rows.shift().map((header) => header.trim());
  return rows.map((row) =>
    headers.reduce((obj, header, index) => {
      obj[header] = (row[index] || "").trim();
      return obj;
    }, {})
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatGigDate(dateStr) {
  const raw = (dateStr || "").trim();
  if (!raw || /^t\.?b\.?a\.?$/i.test(raw)) {
    return { month: "TBA", day: "", weekday: "" };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return { month: raw, day: "", weekday: "" };
  }

  return {
    month: parsed.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(parsed.getDate()).padStart(2, "0"),
    weekday: parsed.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
  };
}

function renderGigList(gigs) {
  const gigsList = document.getElementById("gigs-list");
  if (!gigsList) {
    return;
  }

  gigsList.innerHTML = "";

  if (!gigs || gigs.length === 0) {
    gigsList.innerHTML = `<p class="shows-empty">No upcoming shows. Check back soon!</p>`;
    return;
  }

  gigs.forEach((gig) => {
    const dateParts = formatGigDate(gig.Date);
    const row = document.createElement("article");
    row.className = "shows-row";
    const weekday = dateParts.weekday
      ? `<span class="shows-date-weekday">${escapeHtml(dateParts.weekday)}</span>`
      : "";
    const day = dateParts.day
      ? `<span class="shows-date-day">${escapeHtml(dateParts.day)}</span>`
      : "";
    const timeHtml = (gig.Time || "").trim()
      ? `<p class="shows-time">${escapeHtml(gig.Time.trim())}</p>`
      : "";
    row.innerHTML = `
      <div class="shows-date">
        <span class="shows-date-month">${escapeHtml(dateParts.month)}</span>
        ${day}
        ${weekday}
      </div>
      <p class="shows-venue">${escapeHtml(gig.Location || "T.B.A.")}</p>
      ${timeHtml}
    `;
    gigsList.appendChild(row);
  });
}

function showGigsError() {
  const gigsList = document.getElementById("gigs-list");
  if (gigsList) {
    gigsList.innerHTML = `<p class="shows-error">Error loading shows. Please check back later.</p>`;
  }
}

function loadGigsFromJson() {
  return fetch(LOCAL_GIGS_URL).then((res) => {
    if (!res.ok) {
      throw new Error("Local gigs.json failed");
    }
    return res.json();
  });
}

function renderGigs() {
  const gigsList = document.getElementById("gigs-list");
  if (window.location.protocol === "file:") {
    if (gigsList) {
      gigsList.innerHTML = `<p class="text-center text-muted">Shows and music need a local server. In Terminal run: python3 -m http.server 8080 then open http://localhost:8080</p>`;
    }
    return;
  }

  fetch(SHEET_CSV_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Sheet request failed");
      }
      return res.text();
    })
    .then((csv) => {
      renderGigList(parseCsv(csv));
    })
    .catch(() => {
      loadGigsFromJson().then(renderGigList).catch(() => {
        showGigsError();
      });
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderGigs);
} else {
  renderGigs();
}
