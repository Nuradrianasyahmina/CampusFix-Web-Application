const API = "http://localhost/admin/public/api";


axios.defaults.baseURL = API;
axios.defaults.headers.common["Accept"] = "application/json";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// =======================
// ADMIN GUARD
// =======================
if (!token || role !== "admin") {
  location.href = "login.html";
}

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// =======================
// LOAD ADMIN DASHBOARD
// =======================
async function renderAdminDashboard() {
  try {
    const res = await axios.get("/admin/reports");
    const reports = res.data;

    document.getElementById("adminReportsCount").innerText = reports.length;
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

    renderAdminReports(reports);

  } catch {
    console.warn("Admin API failed — staying logged in");
  }
}

// =======================
// RENDER ADMIN REPORTS
// =======================
function renderAdminReports(reports) {
  const container = document.getElementById("adminReportsContainer");
  const empty = document.getElementById("adminEmptyState");

  container.innerHTML = "";

  if (!reports || reports.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  reports.forEach(r => {
    container.innerHTML += `
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="report-title">${r.title}</div>
            <div class="report-meta">${r.category} • ${new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          <div class="badges">
            <span class="badge status-${r.status}">${r.status}</span>
            <span class="badge urg-${r.urgency.toLowerCase()}">${r.urgency}</span>
          </div>
        </div>
        <p>${r.description}</p>
      </div>
    `;
  });
}

// =======================
// LOGOUT
// =======================
document.getElementById("logoutButton").onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.href = "login.html";
};

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", renderAdminDashboard);
