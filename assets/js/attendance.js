// ============ CHECK AUTH ============
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "student") {
  window.location.href = "index.html";
}

// ============ ELEMENTS ============
const lecturesContainer = document.getElementById("lecturesContainer");
const studentName = document.getElementById("studentName");
const logoutBtn = document.getElementById("logoutBtn");

// ============ DATA ============
let lectures = JSON.parse(localStorage.getItem("lecturesList")) || [];
let attendance = JSON.parse(localStorage.getItem("attendanceList")) || [];

// ============ SHOW STUDENT NAME ============
studentName.textContent = `Welcome, ${user.name}`;

// ============ LOGOUT ============
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

// ============ RENDER LECTURES ============
function renderLectures() {
  lecturesContainer.innerHTML = "";

  const availableLectures = lectures.filter(
    (lec) =>
      lec.active === true &&
      lec.level === user.level.toLowerCase() &&
      lec.group === user.group.toLowerCase()
  );

  if (availableLectures.length === 0) {
    lecturesContainer.innerHTML = `
      <p class="text-gray-500 text-center mt-6">No active lectures right now </p>
    `;
    return;
  }

  availableLectures.forEach((lecture) => {
    const card = document.createElement("div");
    card.className = " shadow-md p-4 rounded mb-4";

    card.innerHTML = `
      <h3 class="text-lg font-semibold">${lecture.name}</h3>
      <p><strong>Time:</strong> ${new Date(lecture.time).toLocaleString()}</p>
      <p><strong>Level:</strong> ${lecture.level.toUpperCase()}</p>
      <p><strong>Group:</strong> ${lecture.group.toUpperCase()}</p>
      <div class="mt-3">
<input type="text" id="otp-${lecture.id}" placeholder="Enter OTP"
  class="border p-2 rounded w-1/2 text-black" />

        <button onclick="markAttendance(${lecture.id})"
          class="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 ml-2">Submit</button>
      </div>
    `;
    lecturesContainer.appendChild(card);
  });
}

// ============ MARK ATTENDANCE ============
function markAttendance(lectureId) {
  const lecture = lectures.find((l) => l.id === lectureId);
  const enteredOtp = document.getElementById(`otp-${lectureId}`).value.trim();

  if (enteredOtp === "") {
    alert("Please enter OTP first!");
    return;
  }

  if (enteredOtp !== lecture.otp.toString()) {
    alert(" Invalid OTP. Try again!");
    return;
  }

  // Check if already attended
  const alreadyMarked = attendance.some(
    (a) => a.email === user.email && a.lectureId === lectureId
  );
  if (alreadyMarked) {
    alert(" You already marked attendance for this lecture.");
    return;
  }

  const record = {
    studentName: user.name,
    email: user.email,
    lectureName: lecture.name,
    lectureId: lecture.id,
    level: lecture.level,
    group: lecture.group,
    time: new Date().toISOString(),
  };

  attendance.push(record);
  localStorage.setItem("attendanceList", JSON.stringify(attendance));

  alert(" Attendance marked successfully!");
  document.getElementById(`otp-${lectureId}`).value = "";
}

// ============ INITIAL RENDER ============
renderLectures();
