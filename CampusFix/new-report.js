// AUTH
if (!localStorage.getItem("token")) {
  location.href = "login.html";
}

const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");
const previewImg = document.getElementById("previewImg");
const uploadText = document.getElementById("uploadText");

let imageData = "";

/* CLICK UPLOAD BOX */
uploadBox.onclick = () => imageInput.click();

/* IMAGE PICK */
imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imageData = reader.result;
    previewImg.src = imageData;
    previewImg.hidden = false;
    uploadText.hidden = true;
  };
  reader.readAsDataURL(file);
};

/* SUBMIT */
document.getElementById("submitBtn").onclick = () => {
  if (!imageData) return alert("Image required");
  if (!category.value || !urgency.value || !location.value || !description.value)
    return alert("Please fill all fields");

  const reports = JSON.parse(localStorage.getItem("reports")) || [];

  reports.push({
    category: category.value,
    urgency: urgency.value,
    location: location.value,
    description: description.value,
    status: "pending",
    image: imageData,
    created_at: new Date().toISOString()
  });

  localStorage.setItem("reports", JSON.stringify(reports));
  alert("Report submitted");
  location.href = "user-dashboard.html";
};
