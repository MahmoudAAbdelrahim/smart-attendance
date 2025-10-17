// ================== MAIN DASHBOARD CONTROL ==================
const studentsTab = document.getElementById("studentsTab");
const lecturesTab = document.getElementById("lecturesTab");
const studentsSection = document.getElementById("studentsSection");
const lecturesSection = document.getElementById("lecturesSection");

if (studentsTab && lecturesTab) {
  studentsTab.addEventListener("click", () => {
    studentsSection.classList.remove("hidden");
    lecturesSection.classList.add("hidden");
    studentsTab.classList.add("bg-blue-600", "text-white");
    lecturesTab.classList.remove("bg-blue-600", "text-white");
  });

  lecturesTab.addEventListener("click", () => {
    lecturesSection.classList.remove("hidden");
    studentsSection.classList.add("hidden");
    lecturesTab.classList.add("bg-blue-600", "text-white");
    studentsTab.classList.remove("bg-blue-600", "text-white");
  });
}

// ================== LOGOUT FIX ==================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/smart-attendance/index.html"; // أو "index.html" حسب مكان الصفحة
  });
}
