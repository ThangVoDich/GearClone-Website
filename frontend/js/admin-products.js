document.addEventListener("DOMContentLoaded", () => {
  const API = location.hostname === "localhost"
    ? "http://localhost:8888/api"
    : "http://backend:5050/api";
  const token = localStorage.getItem("token");

  if (!token) return (window.location.href = "login.html");

  // Xác thực quyền admin
  fetch(`${API}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
      if (!user.isAdmin) {
        alert("Không có quyền truy cập");
        return (window.location.href = "index.html");
      }
      loadProducts();
    });

  const tbody = document.getElementById("product-table-body");
  const form = document.getElementById("productForm");
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  const previewImage = document.getElementById("previewImage");

  const categorySelect = document.getElementById("category-select");
  const subcategorySelect = document.getElementById("subcategory-select");

  const subcategories = {
    laptop: ["laptop-gaming", "laptop-vanphong", "macbook"],
    pc: ["pc-gaming", "pc-dohoa", "pc-vanphong"],
    accessories: ["ban-phim", "chuot", "tai-nghe"],
    component: ["cpu", "mainboard", "ram", "ssd-hdd", "gpu"]
  };

  let isEdit = false;
  let currentId = null;

  // Load sản phẩm
  async function loadProducts() {
    const res = await fetch(`${API}/admin/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const products = await res.json();
    tbody.innerHTML = products.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.price.toLocaleString()}đ</td>
        <td>${p.category}</td>
        <td>${p.subcategory}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick='editProduct(${JSON.stringify(p)})'>✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p._id}')">🗑</button>
        </td>
      </tr>
    `).join("");
  }

  // Cập nhật danh sách subcategory theo category
  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;
    subcategorySelect.innerHTML = `<option value="">-- Chọn phân loại --</option>`;
    if (subcategories[selected]) {
      subcategories[selected].forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subcategorySelect.appendChild(option);
      });
    }
  });

  // Mở modal thêm mới
  document.getElementById("addProductBtn")?.addEventListener("click", () => {
    form.reset();
    previewImage.src = "";
    isEdit = false;
    currentId = null;
    subcategorySelect.innerHTML = `<option value="">-- Chọn phân loại --</option>`;
    modal.show();
  });

  // Xử lý xoá
  window.deleteProduct = async (id) => {
    if (!confirm("Xoá sản phẩm này?")) return;
    await fetch(`${API}/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadProducts();
  };

  // Mở modal sửa
  window.editProduct = (product) => {
    isEdit = true;
    currentId = product._id;
    form.name.value = product.name;
    form.price.value = product.price;
    categorySelect.value = product.category;

    // Kích hoạt onchange để render subcategory
    const event = new Event("change");
    categorySelect.dispatchEvent(event);

    // Delay để subcategory-select kịp render
    setTimeout(() => {
      subcategorySelect.value = product.subcategory;
    }, 100);

    form.imageUrl.value = product.image;
    previewImage.src = product.image;
    modal.show();
  };

  // Preview ảnh
  form.imageFile.addEventListener("change", () => {
    const file = form.imageFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImage.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Gửi form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
   const data = {
        name: form.name.value,
        price: +form.price.value,
        category: form.category.value,
        subcategory: document.getElementById("subcategory-select").value,
        image: form.imageUrl.value || previewImage.src,
        description: document.querySelector("textarea[name='description']").value
        };


        
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${API}/admin/products/${currentId}`
      : `${API}/admin/products`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    modal.hide();
    loadProducts();
  });
});
