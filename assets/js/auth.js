// ================== AUTHENTICATION SYSTEM ==================

// تعريف مصفوفة المستخدمين المبدئية
// تحتوي على بيانات الدخول (إيميل، باسورد، الدور، الاسم...)
// لاحقًا ممكن تربطها بقاعدة بيانات حقيقية
const users = [
  {
    email: "admin@uni.edu.eg", // إيميل الأدمن
    password: "admin123",      // كلمة السر للأدمن
    role: "admin",              // الدور: مسؤول النظام
    name: "System Admin"        // اسم المستخدم
  },
  {
    email: "user0@uni.edu.eg", // إيميل الطالب
    password: "123456",         // كلمة السر
    role: "student",            // الدور: طالب
    name: "user0",              // الاسم
    level:"2",                  // المستوى الدراسي
    group:"c"                   // المجموعة
  },
  {
    email: "user00@uni.edu.eg",
    password: "1234566",
    role: "student",
    name: "user00",
    level:"2",
    group:"c"
  },
  {
    email: "user000@uni.edu.eg",
    password: "12345666",
    role: "student",
    name: "user000",
    level:"2",
    group:"c"
  },
  {
    email: "user1@uni.edu.eg",
    password: "654321",
    role: "student",
    name: "user1",
    level:"2",
    group:"a"
  },
  {
    email: "user2@uni.edu.eg",
    password: "654321",
    role: "student",
    name: "user2",
    level:"2",
    group:"b"
  },
  {
    email: "user3@uni.edu.eg",
    password: "654321",
    role: "student",
    name: "user3",
    level:"2",
    group:"d"
  }
];

// ================== LOGIN HANDLER ==================
// ينتظر تحميل الصفحة بالكامل لتجهيز عملية تسجيل الدخول
document.addEventListener("DOMContentLoaded", () => {

  // يحصل على عنصر الفورم الخاص بتسجيل الدخول
  const form = document.getElementById("loginForm");
  if (!form) return; // لو الفورم مش موجود يوقف التنفيذ

  // عند إرسال النموذج
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // يمنع التحديث الافتراضي للصفحة

    // يحصل على القيم المدخلة من المستخدم
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // يبحث في المصفوفة عن مستخدم يطابق الإيميل والباسورد
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // لو مفيش مستخدم مطابق → رسالة خطأ
    if (!user) {
      alert("Invalid academic email or password.");
      return;
    }

    // إنشاء كائن يمثل الجلسة الحالية (Session)
    // يحتوي على بيانات المستخدم + وقت تسجيل الدخول
    const session = {
      email: user.email,
      role: user.role,
      name: user.name,
      level: user.level,
      group: user.group,
      loginTime: new Date().toISOString() // وقت الدخول الحالي
    };

    // حفظ الجلسة في localStorage عشان تبقى متاحة أثناء التصفح
    localStorage.setItem("loggedInUser", JSON.stringify(session));

    // توجيه المستخدم حسب دوره
    if (user.role === "admin") {
      window.location.href = "admin.html"; // لو أدمن → صفحة الأدمن
    } else {
      window.location.href = "attendance.html"; // لو طالب → صفحة الحضور
    }
  });
});

// ================== AUTH VALIDATION ==================
// دالة لحماية الصفحات من الوصول غير المصرح
// بتتحقق لو المستخدم مسجل دخول أو لا
function checkAuth(allowedRole = null) {
  const session = localStorage.getItem("loggedInUser"); // قراءة الجلسة من التخزين المحلي

  // لو مفيش جلسة → يرجع لصفحة تسجيل الدخول
  if (!session) {
    window.location.href = "index.html";
    return null;
  }

  // تحويل النص المحفوظ لكائن JavaScript
  const user = JSON.parse(session);

  // لو الصفحة مخصصة لدور معين (مثلاً admin فقط)
  // والمستخدم مش من نفس الدور → يرجع للصفحة الرئيسية
  if (allowedRole && user.role !== allowedRole) {
    alert("Unauthorized access");
    window.location.href = "index.html";
    return null;
  }

  // بيرجع بيانات المستخدم الجاهزة للاستخدام في الصفحة
  return user;
}

// ================== LOGOUT FUNCTION ==================
// دالة لتسجيل الخروج من النظام
// بتحذف الجلسة من localStorage وتمنع الرجوع بالزر Back
function logout() {
  localStorage.removeItem("loggedInUser"); // حذف بيانات الجلسة
  window.location.replace("index.html");   // إعادة التوجيه بدون حفظ الصفحة في الـ history
}
