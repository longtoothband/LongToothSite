import fetch from 'node-fetch';
import fs from 'fs';

// Your existing code to fetch the CSV data and save as JSON
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr9OC_eu2h6pueqFjPVv01aKW10WNLWLU-iSdUDKgmR9yO_iyIAWW0o3eu7Ms9dSV2G3ShUxuBvR_N/pub?gid=0&single=true&output=csv";

fetch(sheetURL)
  .then((res) => res.text())
  .then((csv) => {
    const rows = csv.split("\n").map((row) => row.split(","));
    const headers = rows.shift(); // Extract headers
    const jsonData = rows.map((row) => {
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = row[index].trim();
        return obj;
      }, {});
    });

    // Save the JSON file
    fs.writeFileSync("./data/gigs.json", JSON.stringify(jsonData, null, 2));
    console.log("Gig data saved to gigs.json!");
  })
  .catch((err) => console.error("Error fetching Google Sheet:", err));
