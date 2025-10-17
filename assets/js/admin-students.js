// ================== STUDENTS MANAGEMENT ==================
// هذا القسم مسؤول عن إدارة بيانات الطلاب (إضافة - تعديل - حذف - عرض).

// تحميل قائمة الطلاب من localStorage أو إنشاء مصفوفة فاضية لو مش موجودة.
let students = JSON.parse(localStorage.getItem("studentsList")) || [];

// الحصول على عنصر الجدول اللي هيتم عرض الطلاب فيه.
const studentsTable = document.getElementById("studentsTable");

// ================== AUTH CHECK ==================
// التحقق من أن المستخدم الحالي مسجل دخول.
// لو مفيش مستخدم مسجل → يتم تحويله مباشرة لصفحة تسجيل الدخول.
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.href = "/smart-attendance/index.html"; // عدّل المسار حسب مكان المشروع عندك
}

// ================== FUNCTION: renderStudents ==================
// وظيفة: عرض الطلاب في الجدول على الواجهة.
// بتفرغ الجدول الأول، وبعدها بتضيف صف لكل طالب من المصفوفة.
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

// ================== EVENT: studentForm Submit ==================
// عند إرسال النموذج، بيمنع التحديث الافتراضي للصفحة.
// بعدين بيجمع البيانات من الحقول، ويضيف الطالب للمصفوفة والـlocalStorage.
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

  // حفظ الطالب في المصفوفة وتحديث التخزين المحلي.
  students.push(student);
  localStorage.setItem("studentsList", JSON.stringify(students));

  // تحديث الجدول وإعادة ضبط الحقول.
  renderStudents();
  e.target.reset();
});

// ================== FUNCTION: deleteStudent ==================
// وظيفة: حذف طالب من القائمة حسب الـ index.
// بعد الحذف يتم تحديث الـlocalStorage وإعادة عرض الجدول.
function deleteStudent(index) {
  students.splice(index, 1);
  localStorage.setItem("studentsList", JSON.stringify(students));
  renderStudents();
}

// ================== FUNCTION: editStudent ==================
// وظيفة: تعديل بيانات طالب.
// بيملأ الحقول بالقيم الحالية للطالب عشان المستخدم يعدّلها.
// بعد كده بيحذف النسخة القديمة من الطالب ويفضل ينتظر الإرسال الجديد للنموذج.
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

// ================== INITIAL CALL ==================
// تشغيل أولي عند تحميل الصفحة لعرض الطلاب المخزنين.
renderStudents();
