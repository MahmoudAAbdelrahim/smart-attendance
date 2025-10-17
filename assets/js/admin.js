// ================== إدارة المحاضرات (LECTURES MANAGEMENT) ==================

// تحميل قائمة المحاضرات من localStorage أو إنشاء مصفوفة جديدة فاضية لو مش موجودة
let lectures = JSON.parse(localStorage.getItem("lecturesList")) || [];

// تحميل سجل الحضور من localStorage أو إنشاء مصفوفة جديدة فاضية لو مش موجود
let attendance = JSON.parse(localStorage.getItem("attendanceList")) || [];

// تعريف جدول المحاضرات اللي هيتم عرض البيانات فيه
const lecturesTable = document.getElementById("lecturesTable");


// ================== التحقق من تسجيل الدخول (AUTH CHECK) ==================
// هنا بنتأكد إن في مستخدم داخل فعلاً (loggedInUser)
// لو مش موجود → بيرجعه لصفحة تسجيل الدخول
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.href = "/smart-attendance/index.html"; // عدّل المسار حسب مكان الملف
}


// ================== دالة عرض المحاضرات (Render Lectures) ==================
// مسؤولة عن عرض كل المحاضرات الموجودة في الجدول
function renderLectures() {
  lecturesTable.innerHTML = ""; // تفريغ الجدول قبل إعادة العرض
  lectures.forEach((lecture, index) => {
    const activeStatus = lecture.active ? "🟢 Active" : "🔴 Inactive"; // حالة المحاضرة
    lecturesTable.innerHTML += `
      <tr class="border-b">
        <td class="py-2 px-3">${lecture.name}</td>
        <td class="py-2 px-3">${lecture.time}</td>
        <td class="py-2 px-3">${lecture.level}</td>
        <td class="py-2 px-3">${lecture.group}</td>
        <td class="py-2 px-3">${lecture.otp}</td>
        <td class="py-2 px-3">${activeStatus}</td>
        <td class="py-2 px-3 space-x-2">
          <!-- الأزرار الخاصة بالتحكم في المحاضرة -->
          <button onclick="toggleActive(${index})" class="${lecture.active ? 'text-yellow-600' : 'text-green-600'} hover:underline">
            ${lecture.active ? 'Deactivate' : 'Activate'}
          </button>
          <button onclick="viewAttendance(${lecture.id})" class="text-blue-400 hover:underline">👀 View</button>
          <button onclick="editLecture(${index})" class="text-blue-600 hover:underline">Edit</button>
          <button onclick="deleteLecture(${index})" class="text-red-600 hover:underline">Delete</button>
        </td>
      </tr>`;
  });
}


// ================== إضافة محاضرة جديدة (Add Lecture) ==================
// بتتفاعل مع الفورم لما المستخدم يضغط على "Add Lecture"
document.getElementById("lectureForm").addEventListener("submit", (e) => {
  e.preventDefault(); // منع تحديث الصفحة

  // إنشاء رقم OTP عشوائي للمحاضرة
  const otp = Math.floor(100000 + Math.random() * 900000);

  // تجميع بيانات المحاضرة من الفورم
  const lecture = {
    id: Date.now(), // ID فريد
    name: lectureName.value.trim(),
    time: lectureTime.value,
    level: lectureLevel.value.trim().toLowerCase(),
    group: lectureGroup.value.trim().toLowerCase(),
    otp: otp,
    active: false, // المحاضرة تبدأ غير مفعّلة
  };

  // إضافة المحاضرة للقائمة وتخزينها
  lectures.push(lecture);
  localStorage.setItem("lecturesList", JSON.stringify(lectures));

  // إعادة عرض الجدول وتفريغ الفورم
  renderLectures();
  e.target.reset();
});


// ================== حذف محاضرة (Delete Lecture) ==================
function deleteLecture(index) {
  lectures.splice(index, 1); // حذف المحاضرة من المصفوفة
  localStorage.setItem("lecturesList", JSON.stringify(lectures)); // تحديث البيانات
  renderLectures(); // إعادة العرض
}


// ================== تعديل محاضرة (Edit Lecture) ==================
// بيملأ بيانات المحاضرة المختارة في الفورم عشان تتعدل
function editLecture(index) {
  const l = lectures[index];
  lectureName.value = l.name;
  lectureTime.value = l.time;
  lectureLevel.value = l.level;
  lectureGroup.value = l.group;

  // حذف القديمة استعدادًا لحفظ التعديل الجديد
  lectures.splice(index, 1);
  localStorage.setItem("lecturesList", JSON.stringify(lectures));
  renderLectures();
}


// ================== تفعيل / إيقاف محاضرة (Toggle Active) ==================
// بيبدّل حالة المحاضرة بين Active وInactive
function toggleActive(index) {
  lectures[index].active = !lectures[index].active;
  localStorage.setItem("lecturesList", JSON.stringify(lectures));
  renderLectures();
}


// ================== عرض الطلاب الحاضرين (View Attendance) ==================
// بتفتح مودال فيه قائمة الطلاب اللي حضروا المحاضرة دي
function viewAttendance(lectureId) {
  const lecture = lectures.find(l => l.id === lectureId);
  const records = attendance.filter(a => a.lectureId === lectureId);

  // لو مفيش طلاب حضروا
  if (records.length === 0) {
    alert(`لا يوجد طلاب سجلوا حضور في "${lecture.name}"`);
    return;
  }

  // بناء صفوف الجدول داخل المودال
  let rows = records.map((r, i) => `
    <tr class="border-b border-gray-700">
      <td class="py-2 px-3">${i + 1}</td>
      <td class="py-2 px-3">${r.studentName}</td>
      <td class="py-2 px-3">${r.email}</td>
      <td class="py-2 px-3">${r.level}</td>
      <td class="py-2 px-3">${r.group}</td>
      <td class="py-2 px-3">${r.date}</td>
      <td class="py-2 px-3">${r.otpUsed}</td>
    </tr>`).join("");

  // إنشاء مودال وعرضه في الصفحة
  const modal = document.createElement("div");
  modal.id = "attendanceModal";
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-white/20 backdrop-blur-lg p-6 rounded-2xl w-[90%] max-w-4xl shadow-xl">
        <h3 class="text-2xl font-semibold mb-4 text-white text-center">
          الطلاب الحاضرين في "${lecture.name}"
        </h3>
        <div class="overflow-x-auto max-h-[60vh]">
          <table class="min-w-full text-white border border-white/20 rounded-lg text-sm">
            <thead class="bg-white/10 text-blue-200">
              <tr>
                <th class="py-2 px-3">#</th>
                <th class="py-2 px-3">Name</th>
                <th class="py-2 px-3">Email</th>
                <th class="py-2 px-3">Level</th>
                <th class="py-2 px-3">Group</th>
                <th class="py-2 px-3">Date</th>
                <th class="py-2 px-3">OTP</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <button onclick="document.getElementById('attendanceModal').remove()" class="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg block mx-auto">
          Close
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}


// ================== تشغيل العرض التلقائي عند تحميل الصفحة ==================
renderLectures();
