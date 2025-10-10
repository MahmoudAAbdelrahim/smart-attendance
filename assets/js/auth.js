// ===== auth.js =====

// بيانات ثابتة (ممكن تعدلها لاحقًا أو تسحبها من JSON)
const users = [
  {
    email: "admin@uni.edu.eg",
    password: "admin123",
    role: "admin",
    name: "System Admin"
  },
  {
    email: "user0@uni.edu.eg",
    password: "123456",
    role: "student",
    name: "user0",
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

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // تحقق من وجود المستخدم
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      alert("Invalid academic email or password.");
      return;
    }

    // إنشاء Session بسيط
    const session = {
      email: user.email,
      role: user.role,
      name: user.name,
      level:user.level,
      group:user.group,
      loginTime: new Date().toISOString()
    };

    // تخزين في localStorage
localStorage.setItem("loggedInUser", JSON.stringify(session));

    // توجيه حسب الدور
    if (user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "attendance.html";
    }
  });
});

// حماية الصفحات (تحقق من الـ Session)
function checkAuth(allowedRole = null) {
  const session = localStorage.getItem("sessionUser");
  if (!session) {
    window.location.href = "index.html";
    return null;
  }

  const user = JSON.parse(session);

  // لو الصفحة ليها صلاحية معينة
  if (allowedRole && user.role !== allowedRole) {
    alert("Unauthorized access");
    window.location.href = "index.html";
    return null;
  }

  return user;
}

// تسجيل خروج
function logout() {
  localStorage.removeItem("sessionUser");
  window.location.href = "index.html";
}

