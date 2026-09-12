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

function renderGigList(gigs) {
  const gigsList = document.getElementById("gigs-list");
  if (!gigsList) {
    return;
  }

  gigsList.innerHTML = "";

  if (!gigs || gigs.length === 0) {
    gigsList.innerHTML = `<p class="text-center text-muted">No upcoming shows.</p>`;
    return;
  }

  gigs.forEach((gig) => {
    const gigElement = document.createElement("div");
    gigElement.classList.add("gig-entry", "mb-3", "p-3", "border", "rounded");
    gigElement.innerHTML = `
      <p><strong>Date:</strong> ${gig.Date || ""}</p>
      <p><strong>Location:</strong> ${gig.Location || ""}</p>
      <p><strong>Time:</strong> ${gig.Time || ""}</p>
    `;
    gigsList.appendChild(gigElement);
  });
}

function showGigsError() {
  const gigsList = document.getElementById("gigs-list");
  if (gigsList) {
    gigsList.innerHTML = `<p class="text-center text-danger">Error loading shows. Please check back later.</p>`;
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
      const gigs = parseCsv(csv);
      if (gigs.length === 0) {
        throw new Error("Sheet was empty");
      }
      renderGigList(gigs);
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
