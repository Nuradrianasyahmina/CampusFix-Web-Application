// =======================
// AUTH (LOCAL STORAGE)
// =======================
const token = localStorage.getItem("token");
const role = localStorage.getItem("role") || "user";
const name = localStorage.getItem("name") || "User";

if (!token || role !== "user") {
  location.href = "login.html";
}

// =======================
// DISPLAY USER NAME
// =======================
document.getElementById("welcomeName").innerText = name;

// =======================
// LOAD REPORTS (LOCAL STORAGE)
// =======================
function loadReports() {
  const reports = JSON.parse(localStorage.getItem("reports")) || [];

  document.getElementById("myReportsCount").innerText = reports.length;
  document.getElementById("statTotal").innerText = reports.length;

  let pending = 0, progress = 0, completed = 0;

  reports.forEach(r => {
    if (r.status === "pending") pending++;
    else if (r.status === "in_progress") progress++;
    else if (r.status === "completed") completed++;
  });

  document.getElementById("statPending").innerText = pending;
  document.getElementById("statInProgress").innerText = progress;
  document.getElementById("statCompleted").innerText = completed;

  renderReports(reports);
}

// =======================
// RENDER REPORTS (WITH IMAGE + BUTTONS)
// =======================
function renderReports(reports) {
  const container = document.getElementById("reportsContainer");
  const empty = document.getElementById("emptyState");

  container.innerHTML = "";

  if (reports.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  reports.forEach((r, index) => {
    container.innerHTML += `
      <div class="report-card">

        ${r.image ? `
          <div class="report-card-image">
            <img src="${r.image}" alt="Report Image">
          </div>
        ` : ""}

        <div class="report-card-body">
          <div class="report-card-tags">
            <span class="tag tag-urgency">${r.urgency}</span>
            <span class="tag tag-status">${r.status}</span>
          </div>

          <div class="report-title">${r.category}</div>
          <div class="report-description">${r.description}</div>

          <div class="report-meta">
            📍 ${r.location}<br>
            🕒 ${new Date(r.created_at).toLocaleString()}
          </div>

          <div class="report-card-actions">
            <button class="btn-view-details" onclick="viewDetails(${index})">
              View Details
            </button>
            <button class="btn-delete-report" onclick="deleteReport(${index})">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// =======================
// VIEW DETAILS (FUNCTIONAL)
// =======================
function viewDetails(index) {
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  const r = reports[index];

  alert(
    `CATEGORY: ${r.category}\n` +
    `URGENCY: ${r.urgency}\n` +
    `STATUS: ${r.status}\n\n` +
    `LOCATION:\n${r.location}\n\n` +
    `DESCRIPTION:\n${r.description}\n\n` +
    `DATE:\n${new Date(r.created_at).toLocaleString()}`
  );
}

// =======================
// DELETE REPORT (FUNCTIONAL)
// =======================
function deleteReport(index) {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  if (!confirm("Are you sure you want to delete this report?")) return;

  reports.splice(index, 1);
  localStorage.setItem("reports", JSON.stringify(reports));

  loadReports(); // refresh UI + stats
}

// =======================
// LOGOUT
// =======================
document.getElementById("logoutButton").onclick = () => {
  localStorage.clear();
  location.href = "login.html";
};

// =======================
// INIT
// =======================
loadReports();
