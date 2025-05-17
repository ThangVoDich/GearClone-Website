const API = location.hostname === "localhost"
  ? "http://localhost:8888/api/guest-orders"
  : "http://backend:5050/api/guest-orders";

// Load tóm tắt đơn hàng
document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summary = document.getElementById("order-summary");
  const totalSpan = document.getElementById("total-price");

  if (!Array.isArray(cart) || cart.length === 0) {
    summary.innerHTML = `<li class="list-group-item">Giỏ hàng trống.</li>`;
    return;
  }

  let total = 0;
  summary.innerHTML = "";

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    const subtotal = price * quantity;
    total += subtotal;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `
      <div>
        <h6 class="my-0">${item.name}</h6>
        <small class="text-muted">x${quantity}</small>
      </div>
      <span class="text-muted">${subtotal.toLocaleString()}đ</span>
    `;
    summary.appendChild(li);
  });

  totalSpan.textContent = total.toLocaleString() + "đ";
});

// Gửi đơn hàng không cần đăng nhập
const form = document.getElementById("checkoutForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const note = document.getElementById("note").value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "COD";

  if (!fullname || !email || !address || !phone) {
    alert("❗ Vui lòng điền đầy đủ họ tên, email, địa chỉ và số điện thoại.");
    return;
  }

  const shippingInfo = { fullname, email, address, phone, note };
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: cart,
        shippingInfo,
        totalPrice,
        paymentMethod,
        discountCode: appliedDiscount?.code || null
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đặt hàng thất bại");

    localStorage.setItem("lastOrder", JSON.stringify(cart));
    localStorage.removeItem("cart");
    alert("🎉 Đặt hàng thành công!");
    window.location.href = "success.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
});
let appliedDiscount = null;

document.getElementById("applyDiscountBtn").addEventListener("click", async () => {
  const code = document.getElementById("discountCode").value.trim();
  const feedback = document.getElementById("discountFeedback");
  const discountBox = document.getElementById("discount-amount");
  const discountValueSpan = document.getElementById("discount-value");

  const res = await fetch(`http://localhost:8888/api/discounts/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });

  const data = await res.json();

  if (res.ok && data.percent) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.floor(total * data.percent / 100);
  appliedDiscount = { code, percent: data.percent };
  localStorage.setItem("appliedDiscount", JSON.stringify(appliedDiscount));


  // Cập nhật UI
  feedback.textContent = `✅ Mã hợp lệ: giảm ${data.percent}%`;
  discountValueSpan.textContent = discountAmount.toLocaleString() + "đ";
  discountBox.style.display = "block";

  appliedDiscount = { code, percent: data.percent };
  
  // ✅ GỌI HÀM NÀY:
  updateTotalWithDiscount();

} else {
    feedback.textContent = data.message || "❌ Mã không hợp lệ.";
    discountBox.style.display = "none";
    appliedDiscount = null;
  }
});

localStorage.setItem("appliedDiscount", JSON.stringify(appliedDiscount));


function updateTotalWithDiscount() {
  const totalSpan = document.getElementById("total-price");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discounted = appliedDiscount ? total * (1 - appliedDiscount.percent / 100) : total;
  totalSpan.textContent = Math.ceil(discounted).toLocaleString() + "đ";
}