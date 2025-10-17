// ================== STUDENTS MANAGEMENT ==================
let students = JSON.parse(localStorage.getItem("studentsList")) || [];
const studentsTable = document.getElementById("studentsTable");
// ================== AUTH CHECK ==================
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.href = "/smart-attendance/index.html"; // عدّل المسار حسب مكان ملفك
}

function renderStudents() {
  studentsTable.innerHTML = "";
  students.forEach((student, index) => {
    studentsTable.innerHTML += `
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
      </tr>`;
  });
}

document.getElementById("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const student = {
    name: studentName.value,
    id: studentID.value,
    email: studentEmail.value,
    password: studentPassword.value,
    level: studentLevel.value,
    group: studentGroup.value,
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
  studentName.value = s.name;
  studentID.value = s.id;
  studentEmail.value = s.email;
  studentPassword.value = s.password;
  studentLevel.value = s.level;
  studentGroup.value = s.group;
  students.splice(index, 1);
  localStorage.setItem("studentsList", JSON.stringify(students));
  renderStudents();
}

renderStudents();
