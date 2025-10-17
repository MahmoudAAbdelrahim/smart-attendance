// ================== MAIN DASHBOARD CONTROL ==================
// المتغيرات الخاصة بعناصر التبويب (Tabs) والسكاشن اللي بتظهر أو تختفي
const studentsTab = document.getElementById("studentsTab");      // تبويب الطلاب
const lecturesTab = document.getElementById("lecturesTab");      // تبويب المحاضرات
const studentsSection = document.getElementById("studentsSection"); // قسم إدارة الطلاب
const lecturesSection = document.getElementById("lecturesSection"); // قسم إدارة المحاضرات

// التأكد إن عناصر التبويب موجودة قبل تنفيذ الكود
if (studentsTab && lecturesTab) {

  // عند الضغط على تبويب "الطلاب"
  studentsTab.addEventListener("click", () => {
    // عرض قسم الطلاب وإخفاء قسم المحاضرات
    studentsSection.classList.remove("hidden");
    lecturesSection.classList.add("hidden");

    // تلوين التبويب النشط وتغيير الشكل
    studentsTab.classList.add("bg-blue-600", "text-white");
    lecturesTab.classList.remove("bg-blue-600", "text-white");
  });

  // عند الضغط على تبويب "المحاضرات"
  lecturesTab.addEventListener("click", () => {
    // عرض قسم المحاضرات وإخفاء قسم الطلاب
    lecturesSection.classList.remove("hidden");
    studentsSection.classList.add("hidden");

    // تغيير حالة الألوان بين التبويبين
    lecturesTab.classList.add("bg-blue-600", "text-white");
    studentsTab.classList.remove("bg-blue-600", "text-white");
  });
}

// ================== LOGOUT FIX ==================
// عنصر زر تسجيل الخروج من لوحة التحكم
const logoutBtn = document.getElementById("logoutBtn");

// التحقق من وجود الزر قبل التنفيذ لتجنب الأخطاء
if (logoutBtn) {
  // عند الضغط على زر "Logout"
  logoutBtn.addEventListener("click", () => {
    // حذف بيانات المستخدم من localStorage لإنهاء الجلسة
    localStorage.removeItem("loggedInUser");

    // إعادة التوجيه لصفحة تسجيل الدخول
    // غيّر المسار لو مشروعك في مجلد مختلف
    window.location.href = "/smart-attendance/index.html";
  });
}
