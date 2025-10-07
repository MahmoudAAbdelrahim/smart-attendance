// ============ GLOBAL VARIABLES ============
let students = JSON.parse(localStorage.getItem("studentsList")) || [];
let lectures = JSON.parse(localStorage.getItem("lecturesList")) || [];

// ============ ELEMENTS ============
const studentsTable = document.getElementById("studentsTable");
const lecturesTable = document.getElementById("lecturesTable");

// Tabs
const studentsTab = document.getElementById("studentsTab");
const lecturesTab = document.getElementById("lecturesTab");
const studentsSection = document.getElementById("studentsSection");
const lecturesSection = document.getElementById("lecturesSection");

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

// ============ TAB SWITCHING ============
studentsTab.addEventListener("click", () => {
  studentsSection.classList.remove("hidden");
  lecturesSection.classList.add("hidden");
  studentsTab.classList.add("bg-blue-500", "text-white");
  lecturesTab.classList.remove("bg-blue-500", "text-white");
});

lecturesTab.addEventListener("click", () => {
  lecturesSection.classList.remove("hidden");
  studentsSection.classList.add("hidden");
  lecturesTab.classList.add("bg-blue-500", "text-white");
  studentsTab.classList.remove("bg-blue-500", "text-white");
});

// ============ STUDENTS FUNCTIONS ============
function renderStudents() {
  studentsTable.innerHTML = "";
  students.forEach((student, index) => {
    const row = `
      <tr class="border-b">
        <td class="py-2 px-3">${student.name}</td>
        <td class="py-2 px-3">${student.id}</td>
        <td class="py-2 px-3">${student.email}</td>
        <td class="py-2 px-3">${student.level}</td>
        <td class="py-2 px-3">${student.group}</td>
        <td class="py-2 px-3 space-x-2">
          <button onclick="editStudent(${index})" class="text-blue-600 hover:underline">Edit</button>
          <button onclick="deleteStudent(${index})" class="text-red-600 hover:underline">Delete</button>
        </td>
      </tr>
    `;
    studentsTable.innerHTML += row;
  });
}

document.getElementById("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const student = {
    name: document.getElementById("studentName").value,
    id: document.getElementById("studentID").value,
    email: document.getElementById("studentEmail").value,
    password: document.getElementById("studentPassword").value,
    level: document.getElementById("studentLevel").value,
    group: document.getElementById("studentGroup").value,
  };

  students.push(student);
  localStorage.setItem("studentsList", JSON.stringify(students));
  renderStudents();
  e.target.reset();
});

function deleteStudent(index) {
  students.splice(index, 1);
  localStorage.setItem("studentsList", JSON.stringify(students));
  renderStudents();
}

function editStudent(index) {
  const s = students[index];
  document.getElementById("studentName").value = s.name;
  document.getElementById("studentID").value = s.id;
  document.getElementById("studentEmail").value = s.email;
  document.getElementById("studentPassword").value = s.password;
  document.getElementById("studentLevel").value = s.level;
  document.getElementById("studentGroup").value = s.group;

  students.splice(index, 1);
  localStorage.setItem("studentsList", JSON.stringify(students));
  renderStudents();
}

// ============ LECTURES FUNCTIONS ============
function renderLectures() {
  lecturesTable.innerHTML = "";
  lectures.forEach((lecture, index) => {
    const activeStatus = lecture.active ? "🟢 Active" : "🔴 Inactive";
    const row = `
      <tr class="border-b">
        <td class="py-2 px-3">${lecture.name}</td>
        <td class="py-2 px-3">${lecture.time}</td>
        <td class="py-2 px-3">${lecture.level}</td>
        <td class="py-2 px-3">${lecture.group}</td>
        <td class="py-2 px-3">${lecture.otp}</td>
        <td class="py-2 px-3">${activeStatus}</td>
        <td class="py-2 px-3 space-x-2">
          <button onclick="toggleActive(${index})" 
            class="${lecture.active ? 'text-yellow-600' : 'text-green-600'} hover:underline">
            ${lecture.active ? 'Deactivate' : 'Activate'}
          </button>
          <button onclick="editLecture(${index})" class="text-blue-600 hover:underline">Edit</button>
          <button onclick="deleteLecture(${index})" class="text-red-600 hover:underline">Delete</button>
        </td>
      </tr>
    `;
    lecturesTable.innerHTML += row;
  });
}

document.getElementById("lectureForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const otp = Math.floor(100000 + Math.random() * 900000); // 🔢 Generate random OTP

  const lecture = {
    id: Date.now(),
    name: document.getElementById("lectureName").value.trim(),
    time: document.getElementById("lectureTime").value,
    level: document.getElementById("lectureLevel").value.trim().toLowerCase(),
    group: document.getElementById("lectureGroup").value.trim().toLowerCase(),
    otp: otp,
    active: false, // default inactive
  };

  lectures.push(lecture);
  localStorage.setItem("lecturesList", JSON.stringify(lectures));
  renderLectures();
  e.target.reset();
});

function deleteLecture(index) {
  lectures.splice(index, 1);
  localStorage.setItem("lecturesList", JSON.stringify(lectures));
  renderLectures();
}

function editLecture(index) {
  const l = lectures[index];
  document.getElementById("lectureName").value = l.name;
  document.getElementById("lectureTime").value = l.time;
  document.getElementById("lectureLevel").value = l.level;
  document.getElementById("lectureGroup").value = l.group;

  lectures.splice(index, 1);
  localStorage.setItem("lecturesList", JSON.stringify(lectures));
  renderLectures();
}

//  Toggle Active/Inactive
function toggleActive(index) {
  lectures[index].active = !lectures[index].active;
  localStorage.setItem("lecturesList", JSON.stringify(lectures));
  renderLectures();
}

// ============ INITIAL RENDER ============
renderStudents();
renderLectures();
