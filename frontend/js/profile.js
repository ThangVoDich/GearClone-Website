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
      
        const paymentMethod = order.paymentMethod === "BANK"
          ? "🏦 Chuyển khoản"
          : "💵 Thanh toán khi nhận (COD)";
      
        const paymentStatus = order.isPaid
          ? "✅ Đã thanh toán"
          : "❌ Chưa thanh toán";
      
        const statusLabel = {
          pending: "⏳ Chờ xác nhận",
          confirmed: "✅ Đã xác nhận",
          shipping: "🚚 Đang giao hàng",
          delivered: "📦 Đã giao",
          cancelled: "❌ Đã huỷ"
        };
      
        const trackingStatus = statusLabel[order.status] || "⏳ Đang xử lý";
      
        const items = order.items.map(item =>
          `<li>${item.name} x${item.quantity} - ${item.price.toLocaleString()}đ</li>`
        ).join("");
      
        return `
          <div class="border p-3 mb-3 rounded bg-light">
            <strong>🆔 Mã đơn:</strong> ${order._id}<br>
            <strong>📅 Ngày:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
            <strong>📦 Trạng thái đơn hàng:</strong> ${statusLabel[order.status] || "⏳ Đang xử lý"}<br>
            <strong>💳 Phương thức:</strong> ${order.paymentMethod}<br>
            <strong>💸 Trạng thái thanh toán:</strong> ${order.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}<br>
            ${order.discountCode ? `<strong>🎁 Mã giảm giá:</strong> ${order.discountCode} (-${order.discountPercent}%)<br>` : ""}
            <strong>📦 Sản phẩm:</strong>
            <ul>
              ${order.items.map(item => `<li>${item.name} x${item.quantity} - ${item.price.toLocaleString()}đ</li>`).join("")}
            </ul>
            <strong>💰 Tổng tiền:</strong> <span class="text-danger fw-bold">${order.totalPrice.toLocaleString()}đ</span>
            <br><a class="btn btn-sm btn-outline-primary mt-2" href="order-detail.html?id=${order._id}">🔍 Xem chi tiết</a>
          </div>
`;

      }).join("");
      
  
      orderBox.innerHTML = html;
  
    } catch (err) {
      orderBox.innerHTML = `<p class="text-danger">${err.message}</p>`;
    }
  });
  