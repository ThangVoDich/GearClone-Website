document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const orderBox = document.getElementById("order-history");

  if (!token) {
    orderBox.innerHTML = `<p>Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>`;
    return;
  }

  try {
    const res = await fetch("http://localhost:8888/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Lỗi lấy đơn hàng");

    if (data.length === 0) {
      orderBox.innerHTML = `<p>Chưa có đơn hàng nào.</p>`;
      return;
    }

    const html = data.map(order => {
      const total = order.totalPrice.toLocaleString();
      const date = new Date(order.createdAt).toLocaleDateString();
      const payment = order.paymentMethod || "COD";

      const status =
        payment === "BANK" || order.isPaid
          ? "✅ Đã thanh toán"
          : "❌ Chưa thanh toán";

      const items = order.items.map(item =>
        `<li>${item.name} x${item.quantity} - ${item.price.toLocaleString()}đ</li>`
      ).join("");

      return `
        <div class="border p-3 mb-3 rounded bg-light">
          <strong>🆔 Mã đơn: </strong> ${order._id}<br>
          <strong>🗓 Ngày: </strong> ${date}<br>
          <strong>💳 Phương thức: </strong> ${payment}<br>
          <strong>📦 Trạng thái: </strong> ${status}<br>
          <strong>🛍 Sản phẩm:</strong>
          <ul>${items}</ul>
          <strong>💰 Tổng tiền:</strong> <span class="text-danger fw-bold">${total}đ</span>
        </div>
      `;
    }).join("");

    orderBox.innerHTML = html;

  } catch (err) {
    orderBox.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
});

