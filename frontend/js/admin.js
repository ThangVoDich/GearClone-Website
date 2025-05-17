document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const container = document.getElementById("orders-container");
  
    if (!token) {
      container.innerHTML = `<p class="text-danger">Bạn chưa đăng nhập.</p>`;
      return;
    }
  
    try {
      const res = await fetch("http://localhost:8888/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi lấy đơn hàng");
  
      if (data.length === 0) {
        container.innerHTML = `<p>Không có đơn hàng nào.</p>`;
        return;
      }
  
      let tableHTML = `
        <table class="table table-bordered table-striped align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Ngày</th>
              <th>Phương thức</th>
              <th>Đã thanh toán</th> <!-- ✅ -->
              <th>Trạng thái</th>
              <th>Sản phẩm</th>
              <th>Cập nhật</th>
            </tr>
          </thead>

          <tbody>
      `;
  
      data.forEach(order => {
        const items = order.items.map(i => `<li>${i.name} x${i.quantity}</li>`).join("");
        const statusOptions = ["pending", "confirmed", "shipping", "delivered", "cancelled"]
          .map(status => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`)
          .join("");
  
          tableHTML += `
          <tr>
            <td>${order._id}</td>
            <td>${order.shippingInfo.fullname}<br><small>${order.shippingInfo.phone}</small></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.paymentMethod}</td>
            <td>
              <div class="form-check">
                <input class="form-check-input paid-checkbox" type="checkbox" data-id="${order._id}" ${order.isPaid ? "checked" : ""}>
              </div>
            </td>
            <td>
              <select class="form-select form-select-sm" data-id="${order._id}">
                ${statusOptions}
              </select>
            </td>
            <td><ul>${items}</ul></td>
            <<td>
              <button class="btn btn-sm btn-primary update-btn" data-id="${order._id}">Lưu</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${order._id}">🗑 Xoá</button>
              <button class="btn btn-sm btn-secondary view-btn" data-id="${order._id}">Xem chi tiết</button>

            </td>


          </tr>
        `;
        
      });
  
      tableHTML += `</tbody></table>`;
      container.innerHTML = tableHTML;
  
      // Bắt sự kiện cập nhật
      document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const orderId = btn.dataset.id;
          const select = document.querySelector(`select[data-id='${orderId}']`);
          const newStatus = select.value;
      
          const paidCheckbox = document.querySelector(`.paid-checkbox[data-id='${orderId}']`);
          const isPaid = paidCheckbox.checked;
      
          try {
            const res = await fetch(`http://localhost:8888/api/admin/orders/${orderId}/status`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ status: newStatus, isPaid }) // 👈 gửi cả isPaid
            });
      
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
      
            alert("✅ Cập nhật thành công!");
          } catch (err) {
            alert("❌ Lỗi: " + err.message);
          }
        });
      });
      // Bắt sự kiện nút xoá
document.querySelectorAll(".delete-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const orderId = btn.dataset.id;
    const confirmDelete = confirm("Bạn có chắc muốn xoá đơn hàng này?");
    if (!confirmDelete) return;

    console.log("Đang xoá đơn hàng:", orderId);

    try {
      const res = await fetch(`http://localhost:8888/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();
      console.log("Kết quả xoá:", result);

      if (!res.ok) throw new Error(result.message);
      alert("🗑 Đã xoá đơn hàng!");
      location.reload();
    } catch (err) {
      console.error("❌ Lỗi xoá đơn:", err);
      alert("❌ Lỗi xoá đơn: " + err.message);
    }
  });
});
// Bắt sự kiện nút "Xem chi tiết"
document.querySelectorAll(".view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const orderId = btn.dataset.id;
    // Điều hướng tới trang chi tiết đơn hàng
    window.location.href = `admin-order-detail.html?id=${orderId}`;
  });
});

  
    } catch (err) {
      container.innerHTML = `<p class="text-danger">${err.message}</p>`;
    }
  });
 
  