document.addEventListener("DOMContentLoaded", () => {

  // =======================
  // CONFIG
  // =======================
  const API = "http://localhost/admin/public/api";
  const TOKEN_KEY = "token";

  axios.defaults.baseURL = API;
  axios.defaults.headers.common["Accept"] = "application/json";

  // =======================
  // AUTH CHECK
  // =======================
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    alert("Please login again");
    location.href = "login.html";
    return;
  }

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // =======================
  // FORM CHECK
  // =======================
  const form = document.getElementById("reportForm");
  if (!form) {
    console.error("❌ reportForm not found");
    return;
  }

  // =======================
  // SUBMIT REPORT
  // =======================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageInput = document.getElementById("image");

    if (!imageInput || !imageInput.files.length) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("category", document.getElementById("category").value);
    formData.append("urgency", document.getElementById("urgency").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("description", document.getElementById("description").value);

    try {
      const res = await axios.post("/reports", formData);

      console.log("✅ SUCCESS:", res.data);
      alert("Report submitted successfully!");
      location.href = "user-dashboard.html";

    } catch (err) {
      console.error("❌ SUBMIT ERROR:", err.response?.data || err);

      if (err.response?.status === 422) {
        alert("Validation failed. Please check all fields and image.");
      } else if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        location.href = "login.html";
      } else {
        alert("Failed to submit report");
      }
    }
  });
});
