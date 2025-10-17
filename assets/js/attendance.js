// ============ CHECK AUTH ============
// التحقق من أن المستخدم مسجل دخول وصلاحياته "student"
// إذا لم يكن موجود أو ليس طالب، يُعاد توجيهه لصفحة الدخول
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "student") {
  window.location.href = "index.html";
}

// ============ ELEMENTS ============
// تعريف العناصر الرئيسية في الصفحة للتعامل معها
const lecturesContainer = document.getElementById("lecturesContainer");
const studentName = document.getElementById("studentName");
const logoutBtn = document.getElementById("logoutBtn");
const attendanceTableBody = document.getElementById("attendanceTableBody");

// ============ DATA ============
// جلب بيانات المحاضرات والحضور من localStorage
let lectures = JSON.parse(localStorage.getItem("lecturesList")) || [];
let attendance = JSON.parse(localStorage.getItem("attendanceList")) || [];

// ============ SHOW STUDENT NAME ============
// عرض اسم الطالب في الواجهة
studentName.textContent = `Welcome, ${user.name}`;

// ============ LOGOUT ============
// عند الضغط على زر الخروج، حذف الجلسة والعودة للصفحة الرئيسية
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

// ============ RENDER LECTURES ============
// عرض المحاضرات النشطة للطالب وفق المستوى والمجموعة
function renderLectures() {
  lecturesContainer.innerHTML = "";

  // تصفية المحاضرات النشطة والمتوافقة مع الطالب
  const availableLectures = lectures.filter(
    (lec) =>
      lec.active === true &&
      lec.level === user.level.toLowerCase() &&
      lec.group === user.group.toLowerCase()
  );

  // إذا لا توجد محاضرات متاحة
  if (availableLectures.length === 0) {
    lecturesContainer.innerHTML = `
      <p class="text-gray-500 text-center mt-6">No active lectures right now</p>
    `;
    return;
  }

  // إنشاء بطاقة لكل محاضرة
  availableLectures.forEach((lecture) => {
    const card = document.createElement("div");
    card.className = "shadow-md p-4 rounded mb-4 bg-white/80 text-gray-900";

    // التحقق إذا الطالب سجل الحضور بالفعل
    const alreadyMarked = attendance.some(
      (a) => a.email === user.email && a.lectureId === lecture.id
    );

    // بناء محتوى البطاقة
    card.innerHTML = `
      <h3 class="text-lg font-semibold">${lecture.name}</h3>
      <p><strong>Time:</strong> ${new Date(lecture.time).toLocaleString()}</p>
      <p><strong>Level:</strong> ${lecture.level.toUpperCase()}</p>
      <p><strong>Group:</strong> ${lecture.group.toUpperCase()}</p>
      <div class="mt-3">
        ${
          alreadyMarked
            ? `<p class="text-green-600 font-semibold">✅ Your attendance has already been registered.</p>`
            : `
              <input type="text" id="otp-${lecture.id}" placeholder="Enter OTP"
                class="border p-2 rounded w-1/2 text-black" />
              <button id="submit-${lecture.id}" onclick="markAttendance(${lecture.id})"
                class="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 ml-2">Submit</button>
            `
        }
      </div>
    `;
    lecturesContainer.appendChild(card);
  });
}

// ============ MARK ATTENDANCE ============
// تسجيل حضور الطالب بعد إدخال OTP والتحقق منه
function markAttendance(lectureId) {
  const lecture = lectures.find((l) => l.id === lectureId);
  const enteredOtp = document.getElementById(`otp-${lectureId}`).value.trim();

  // التحقق من إدخال OTP
  if (enteredOtp === "") {
    alert("Please enter OTP first!");
    return;
  }

  // التحقق من صحة OTP
  if (enteredOtp !== lecture.otp.toString()) {
    alert("Invalid OTP. Try again!");
    return;
  }

  // منع التسجيل المكرر
  const alreadyMarked = attendance.some(
    (a) => a.email === user.email && a.lectureId === lectureId
  );
  if (alreadyMarked) {
    alert("You already marked attendance for this lecture.");
    return;
  }

  // إنشاء سجل الحضور
  const record = {
    studentName: user.name,
    email: user.email,
    lectureName: lecture.name,
    lectureId: lecture.id,
    otpUsed: enteredOtp,
    level: lecture.level,
    group: lecture.group,
    date: new Date().toLocaleString(),
  };

  // إضافة السجل للبيانات وحفظه في localStorage
  attendance.push(record);
  localStorage.setItem("attendanceList", JSON.stringify(attendance));

  alert("Registration completed successfully");
  renderLectures();
  renderAttendanceTable();
}

// ============ RENDER ATTENDANCE TABLE ============
// عرض جدول الحضور الخاص بالطالب
function renderAttendanceTable() {
  attendanceTableBody.innerHTML = "";

  const myAttendance = attendance.filter((a) => a.email === user.email);

  if (myAttendance.length === 0) {
    attendanceTableBody.innerHTML = `
      <tr><td colspan="3" class="text-center text-blue-200 py-2">No attendance records yet</td></tr>
    `;
    return;
  }

  myAttendance.forEach((record) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="py-2">${record.lectureName}</td>
      <td class="py-2">${record.date}</td>
      <td class="py-2">${record.otpUsed}</td>
    `;
    attendanceTableBody.appendChild(tr);
  });
}

// ============ INITIAL RENDER ============
// عند تحميل الصفحة، عرض المحاضرات وسجل الحضور
renderLectures();
renderAttendanceTable();
