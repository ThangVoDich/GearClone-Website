document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("id");
    const token = localStorage.getItem("token");
    const container = document.getElementById("order-detail-box");
  
    if (!token) {
      container.innerHTML = `<p class="text-danger">Bạn chưa đăng nhập.</p>`;
      return;
    }
  
    if (!orderId) {
      container.innerHTML = `<p class="text-danger">Không tìm thấy đơn hàng.</p>`;
      return;
    }
  
    try {
     const res = await fetch(`http://localhost:8888/api/orders/${orderId}`, {

        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const order = await res.json();
      if (!res.ok) throw new Error(order.message || "Không tìm thấy đơn hàng");
  
      const statusLabel = {
        pending: "⏳ Chờ xác nhận",
        confirmed: "✅ Đã xác nhận",
        shipping: "🚚 Đang giao hàng",
        delivered: "📦 Đã giao",
        cancelled: "❌ Đã huỷ"
      };
  
      const products = order.items.map(i => `
        <li>${i.name} x${i.quantity} — ${i.price.toLocaleString()}đ</li>
      `).join("");
  
      const paid = order.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán";
      const method = order.paymentMethod === "BANK" ? "🏦 Chuyển khoản" : "💵 COD";
      const status = statusLabel[order.status] || order.status;
      const note = order.shippingInfo?.note || "(Không có)";
  
      container.innerHTML = `
        <div>
          <p><strong>🆔 Mã đơn:</strong> ${order._id}</p>
          <p><strong>🗓 Ngày tạo:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <hr>
          <p><strong>👤 Khách hàng:</strong> ${order.shippingInfo.fullname}</p>
          <p><strong>📧 Email:</strong> ${order.user?.email || "(không có email)"}</p>
          <p><strong>📞 Số điện thoại:</strong> ${order.shippingInfo.phone}</p>
          <p><strong>📍 Địa chỉ:</strong> ${order.shippingInfo.address}</p>
          <p><strong>📝 Ghi chú:</strong> ${note}</p>
          <hr>
          <p><strong>💳 Phương thức:</strong> ${method}</p>
          <p><strong>💸 Thanh toán:</strong> ${paid}</p>
          <p><strong>📦 Trạng thái:</strong> ${status}</p>
          ${order.discountCode ? `
            <p><strong>🎁 Mã giảm giá:</strong> ${order.discountCode} (${order.discountPercent}%)</p>
          ` : ""}
          <p><strong>💰 Tổng tiền:</strong> <span class="text-danger fw-bold">${order.totalPrice.toLocaleString()}đ</span></p>

          <hr>
          <p><strong>🛍 Sản phẩm:</strong></p>
          <ul>${products}</ul>
        </div>
      `;
  
    } catch (err) {
      container.innerHTML = `<p class="text-danger">Lỗi: ${err.message}</p>`;
    }
  });
  