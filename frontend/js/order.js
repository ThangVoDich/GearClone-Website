const API = location.hostname === "localhost"
  ? "http://localhost:8888/api/orders"
  : "http://backend:5050/api/orders";

let appliedDiscount = null;
let loyaltyDiscount = 0;
let userLoyaltyPoint = 0;

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summary = document.getElementById("order-summary");
  const totalSpan = document.getElementById("total-price");

  if (!user) {
    alert("Bạn cần đăng nhập để thanh toán.");
    window.location.href = "login.html";
    return;
  }

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

  loadLoyaltyPoints();
  updateTotalWithDiscount();
});

// 👉 Load điểm thưởng
async function loadLoyaltyPoints() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API.replace("/orders", "")}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const user = await res.json();
  userLoyaltyPoint = user.loyaltyPoints || 0;
  document.getElementById("loyaltyPointDisplay").textContent = userLoyaltyPoint.toLocaleString();
}

// 👉 Toggle checkbox
document.getElementById("useLoyaltyCheckbox").addEventListener("change", () => {
  const inputGroup = document.getElementById("loyaltyInputGroup");
  if (useLoyaltyCheckbox.checked) {
    inputGroup.style.display = "block";
  } else {
    inputGroup.style.display = "none";
    document.getElementById("loyaltyUsedInput").value = "";
    loyaltyDiscount = 0;
    updateTotalWithDiscount();
  }
});

// 👉 Gõ số điểm
document.getElementById("loyaltyUsedInput").addEventListener("input", () => {
  const val = Math.floor(+document.getElementById("loyaltyUsedInput").value || 0);
  const maxUsable = Math.min(userLoyaltyPoint, getRawTotal());
  if (val > maxUsable) {
    document.getElementById("loyaltyUsedInput").value = maxUsable;
    loyaltyDiscount = maxUsable;
  } else {
    loyaltyDiscount = val * 1000; // vì 1 điểm = 1000đ

  }
  appliedDiscount = null; // huỷ mã nếu dùng điểm
  updateTotalWithDiscount();
});

function getRawTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

// 🧾 Gửi đơn hàng
const form = document.getElementById("checkoutForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const fullname = document.getElementById("fullname").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const note = document.getElementById("note").value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "COD";

  if (!fullname || !address || !phone) {
    alert("❗ Vui lòng nhập đầy đủ họ tên, địa chỉ và số điện thoại.");
    return;
  }

  const shippingInfo = { fullname, address, phone, note };
  const rawTotal = getRawTotal();
  const usedPoints = parseInt(document.getElementById("loyaltyUsedInput")?.value || "0", 10);
  const loyaltyDiscount = usedPoints * 1000; // 1 điểm = 1000đ

  const discountAmount = appliedDiscount
    ? Math.floor(rawTotal * appliedDiscount.percent / 100)
    : loyaltyDiscount;
  const totalPrice = rawTotal - discountAmount;

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart,
        shippingInfo,
        totalPrice,
        paymentMethod,
        discountCode: appliedDiscount?.code || null,
        discountPercent: appliedDiscount?.percent || 0,
        loyaltyUsed: usedPoints // Gửi số điểm sử dụng đến server
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đặt hàng thất bại");

    localStorage.setItem("lastOrder", JSON.stringify(cart));
    localStorage.removeItem("cart");
    if (appliedDiscount) {
      localStorage.setItem("appliedDiscount", JSON.stringify(appliedDiscount));
    }

    alert("🎉 Đặt hàng thành công!");
    window.location.href = "success.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
});

// ✅ Áp dụng mã giảm giá
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
    const total = getRawTotal();
    const discountAmount = Math.floor(total * data.percent / 100);

    feedback.textContent = `✅ Mã hợp lệ: giảm ${data.percent}%`;
    discountValueSpan.textContent = discountAmount.toLocaleString() + "đ";
    discountBox.style.display = "block";

    appliedDiscount = { code, percent: data.percent };
    loyaltyDiscount = 0;
    document.getElementById("useLoyaltyCheckbox").checked = false;
    document.getElementById("loyaltyInputGroup").style.display = "none";
    updateTotalWithDiscount();
  } else {
    feedback.textContent = data.message || "❌ Mã không hợp lệ.";
    discountBox.style.display = "none";
    appliedDiscount = null;
    updateTotalWithDiscount();
  }
});

// 🧮 Cập nhật tổng tiền
function updateTotalWithDiscount() {
  const totalSpan = document.getElementById("total-price");
  const discountValueSpan = document.getElementById("discount-value");
  const loyaltyDiscountBox = document.getElementById("loyalty-discount-amount");
  const loyaltyDiscountValue = document.getElementById("loyalty-discount-value");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;

  if (appliedDiscount) {
    // Ưu tiên mã giảm giá nếu có
    discountAmount = Math.floor(total * appliedDiscount.percent / 100);
    discountValueSpan.textContent = discountAmount.toLocaleString() + "đ";
    document.getElementById("discount-amount").style.display = "block";
    loyaltyDiscountBox.style.display = "none";
  } else {
    const usedPoints = parseInt(document.getElementById("loyaltyUsedInput")?.value || "0", 10);
    discountAmount = usedPoints * 1000;
    loyaltyDiscountValue.textContent = discountAmount.toLocaleString() + "đ";
    loyaltyDiscountBox.style.display = usedPoints > 0 ? "block" : "none";
    document.getElementById("discount-amount").style.display = "none";
  }

  const finalPrice = Math.max(0, total - discountAmount);
  totalSpan.textContent = finalPrice.toLocaleString() + "đ";
}


document.getElementById("loyaltyUsedInput")?.addEventListener("input", () => {
  updateTotalWithDiscount();
});


localStorage.setItem("usedPoints", usedPoints); // Thêm dòng này nếu có dùng điểm
