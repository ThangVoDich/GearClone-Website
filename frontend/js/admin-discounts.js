const API = location.hostname === "localhost"
  ? "http://localhost:8888/api/discounts"
  : "http://backend:5050/api/discounts";

const token = localStorage.getItem("token");
const list = document.getElementById("discountList");
const form = document.getElementById("discountForm");

// Load danh sách
async function loadDiscounts() {
  try {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!Array.isArray(data)) return;

  list.innerHTML = data.map(d => `
  <tr>
    <td><input value="${d.code}" class="form-control code-input" data-id="${d._id}" /></td>
    <td><input type="number" value="${d.percent}" class="form-control percent-input" data-id="${d._id}" /></td>
    <td><input type="date" value="${d.expiresAt ? new Date(d.expiresAt).toISOString().split('T')[0] : ''}" class="form-control date-input" data-id="${d._id}" /></td>
    <td><input type="number" value="${d.usageLimit}" class="form-control limit-input" data-id="${d._id}" /></td>
    <td>${d.used}</td>
    <td>
      <button class="btn btn-sm btn-primary update-btn" data-id="${d._id}">💾</button>
      <button class="btn btn-sm btn-danger" onclick="deleteDiscount('${d._id}')">🗑</button>
    </td>
  </tr>
`).join("");

  } catch (err) {
    console.error("Lỗi tải danh sách:", err);
  }
}

// Xoá mã
async function deleteDiscount(id) {
  if (!confirm("Xoá mã này?")) return;
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.message);
    loadDiscounts();
  } catch (err) {
    alert("❌ Lỗi xoá mã");
  }
}

// Gửi form tạo mã
form.addEventListener("submit", async e => {
  e.preventDefault();

  const code = document.getElementById("code").value.trim();
  const percent = +document.getElementById("percent").value;
  const expiresAt = document.getElementById("expiresAt").value;
  const usageLimit = +document.getElementById("usageLimit").value;

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ code, percent, usageLimit, expiresAt: expiresAt || null })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert("✅ Đã tạo mã mới!");
    form.reset();
    loadDiscounts();
  } catch (err) {
    alert("❌ " + err.message);
  }
});
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("update-btn")) {
    const id = e.target.dataset.id;
    const code = document.querySelector(`.code-input[data-id='${id}']`).value;
    const percent = document.querySelector(`.percent-input[data-id='${id}']`).value;
    const expiresAt = document.querySelector(`.date-input[data-id='${id}']`).value;
    const usageLimit = document.querySelector(`.limit-input[data-id='${id}']`).value;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code, percent, expiresAt, usageLimit })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert("✅ Cập nhật thành công!");
      loadDiscounts();
    } catch (err) {
      alert("❌ Lỗi cập nhật: " + err.message);
    }
  }
});

loadDiscounts();
