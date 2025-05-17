const API_BASE = location.hostname === "localhost"
  ? "http://localhost:8888/api"
  : "http://backend:5050/api";

const token = localStorage.getItem("token");

async function loadSummary() {
  try {
    const [userRes, orderRes] = await Promise.all([
      fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${API_BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    // Xử lý người dùng
    let users = [];
    if (userRes.ok) {
      users = await userRes.json();
      document.getElementById("total-users").textContent = Array.isArray(users) ? users.length : 0;
    } else {
      document.getElementById("total-users").textContent = "Lỗi";
      console.error("❌ Lỗi lấy users:", await userRes.text());
    }

    // Xử lý đơn hàng
    let orders = [];
    if (orderRes.ok) {
      orders = await orderRes.json();
    } else {
      document.getElementById("total-orders").textContent = "Lỗi";
      console.error("❌ Lỗi lấy orders:", await orderRes.text());
      return;
    }

    // Tổng số đơn hàng
    document.getElementById("total-orders").textContent = orders.length;

    // Tổng doanh thu
    const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    document.getElementById("total-revenue").textContent = revenue.toLocaleString() + "đ";

    // Số đơn đang xử lý
    const processing = orders.filter(o =>
      o.status === "pending" || o.status === "confirmed"
    ).length;
    document.getElementById("processing-orders").textContent = processing;

    // Vẽ biểu đồ doanh thu theo tháng
    const monthlyRevenue = new Array(12).fill(0);
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.getMonth();
      monthlyRevenue[month] += order.totalPrice || 0;
    });
    renderChart(monthlyRevenue);

  } catch (err) {
    console.error("❌ Lỗi khi load dashboard:", err);
  }
}

function renderChart(data) {
  const ctx = document.getElementById("revenueChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
      datasets: [{
        label: "Doanh thu (VNĐ)",
        data,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value.toLocaleString("vi-VN") + "đ"
          }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    alert("⚠️ Bạn cần đăng nhập với quyền admin để truy cập.");
    return (window.location.href = "login.html");
  }

  fetch(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      if (!user.isAdmin) {
        alert("❌ Bạn không có quyền truy cập trang này.");
        window.location.href = "index.html";
      } else {
        loadSummary(); // ✅ Gọi khi chắc chắn là admin
      }
    })
    .catch(err => {
      console.error("Lỗi kiểm tra quyền:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
      window.location.href = "index.html";
    });
});
