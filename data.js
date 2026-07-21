const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeiFl1vl6V58mJ1HVjEWmnjrUgLcRoZL4zbTqw60AIYdF0QU2PalmtDa4y9hARanYkhPg9NmoXNYUi/pub?output=csv";

async function loadSiteData() {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error("Failed to load site data:", error);
        return {};
    }
}

function parseCSV(csvText) {
    const data = {};
    const rows = csvText.trim().split("\n");

    // Skip the header row (row 0), start at row 1
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.trim()) continue; // skip blank lines

        const [key, value] = splitCSVRow(row);
        if (key) {
            data[key.trim()] = value ? value.trim() : "";
        }
    }

    return data;
}

function splitCSVRow(row) {
    const fields = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
            fields.push(current);
            current = "";
        } else {
            current += char;
        }
    }
    fields.push(current); // push the last field

    return fields;
}

async function populateSiteData() {
    const data = await loadSiteData();
    const elements = document.querySelectorAll("[data-key]");

    elements.forEach((el) => {
        const key = el.getAttribute("data-key");
        if (data[key] !== undefined) {
            el.textContent = data[key];
        }
    });


    
}




// Run automatically once the page loads
document.addEventListener("DOMContentLoaded", populateSiteData);