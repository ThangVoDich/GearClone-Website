document.addEventListener("DOMContentLoaded", () => {
  const API = location.hostname === "localhost"
    ? "http://localhost:8888/api"
    : "http://backend:5050/api";

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Bạn chưa đăng nhập.");
    return (window.location.href = "login.html");
  }

  fetch(`${API}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      if (!user.isAdmin) {
        alert("Bạn không có quyền truy cập.");
        return (window.location.href = "index.html");
      }
      loadUsers();
    })
    .catch(err => {
      console.error("Lỗi xác thực:", err);
      alert("Có lỗi xảy ra.");
      window.location.href = "index.html";
    });

  async function loadUsers() {
    try {
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const users = await res.json();
      const tbody = document.getElementById("user-table-body");
      tbody.innerHTML = users.map((u, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.isAdmin ? "✅ Admin" : "👤 User"}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="toggleRole('${u._id}', ${u.isAdmin})">
              🔁 Đổi quyền
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser('${u._id}')">
              🗑 Xoá
            </button>
          </td>
        </tr>
      `).join("");

    } catch (err) {
      console.error("Lỗi khi tải danh sách user:", err);
      alert("Không thể tải danh sách người dùng.");
    }
  }

  // Xoá người dùng
  window.deleteUser = async (userId) => {
    if (!confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;
    try {
      const res = await fetch(`${API}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message || "Đã xoá.");
      loadUsers(); // reload lại danh sách
    } catch (err) {
      console.error("Lỗi xoá user:", err);
      alert("Không thể xoá người dùng.");
    }
  };

  // Đổi quyền người dùng
  window.toggleRole = async (userId, isAdmin) => {
    try {
      const res = await fetch(`${API}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isAdmin: !isAdmin })
      });
      const data = await res.json();
      alert(data.message || "Đã đổi quyền.");
      loadUsers(); // reload lại danh sách
    } catch (err) {
      console.error("Lỗi đổi quyền:", err);
      alert("Không thể đổi quyền người dùng.");
    }
  };
});
