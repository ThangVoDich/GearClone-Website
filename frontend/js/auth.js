const API = location.hostname === "localhost"
  ? "http://localhost:8888/api/users"
  : "http://backend:5050/api/users";

// ==== Đăng nhập ====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    const errBox = document.getElementById("login-error");

    if (!res.ok) {
      errBox.classList.remove("d-none");
      errBox.textContent = data.message || "Đăng nhập thất bại!";
      return;
    }

    errBox.classList.add("d-none");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "index.html";
  });
}

// ==== Đăng ký ====
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    const errEl = document.getElementById("register-error");
    const successEl = document.getElementById("register-success");

    if (!res.ok) {
      errEl.style.display = "block";
      errEl.textContent = data.message || "Đăng ký lỗi";
      return;
    }

    errEl.style.display = "none";
    successEl.classList.remove("d-none");
    successEl.textContent = "Đăng ký thành công! Đang chuyển hướng...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  });
}

// ==== Đăng nhập bằng Google ====
window.handleGoogleLogin = async function (response) {
  const credential = response.credential;

  try {
    const res = await fetch(`${API}/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Đăng nhập Google thất bại");
      return;
    }

    if (data.requirePasswordSetup) {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "create-password.html";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "index.html";
  } catch (err) {
    alert("Lỗi khi đăng nhập bằng Google");
  }
};

// ==== Tạo mật khẩu sau khi đăng nhập bằng Google ====
const setPasswordForm = document.getElementById("setPasswordForm");
if (setPasswordForm) {
  setPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`${API}/set-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ newPassword })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Đã lưu mật khẩu thành công");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Lỗi khi đặt mật khẩu");
    }
  });
}
