document.addEventListener("DOMContentLoaded", () => {
  // 🔒 Xử lý hiển thị tài khoản
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdown = document.getElementById("user-info-dropdown");
  const loginLink = document.getElementById("user-login-link");
  const adminLink = document.getElementById("admin-link");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user && user.name) {
    dropdown && (dropdown.style.display = "block");
    loginLink && (loginLink.style.display = "none");
    document.getElementById("username-display").textContent = user.name;
    if (user.isAdmin && adminLink) adminLink.style.display = "block";
  } else {
    dropdown && (dropdown.style.display = "none");
    loginLink && (loginLink.style.display = "block");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  // ✅ Gọi hiển thị sản phẩm
  if (document.getElementById("featured-products")) loadFeaturedProducts();
  if (document.getElementById("all-products")) loadAllProducts();
});


const API_BASE = location.hostname === "localhost"
  ? "http://localhost:8888/api"
  : "http://backend:5050/api";

// ==== Sản phẩm nổi bật ====
async function loadFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE}/products/featured`);
    const products = await res.json();
    renderProducts(products, "featured-products", 4);
  } catch (err) {
    console.error("Lỗi khi load sản phẩm nổi bật:", err);
  }
}

// ==== Tất cả sản phẩm ====
async function loadAllProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();
    renderProducts(products, "all-products");
  } catch (err) {
    console.error("Lỗi khi load tất cả sản phẩm:", err);
  }
}

// Hàm render sản phẩm
function renderProducts(products, containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const shown = limit ? products.slice(0, limit) : products;
  shown.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-3 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-danger fw-bold">${product.price.toLocaleString()}đ</p>
          <a href="product.html?id=${product._id}" class="btn btn-primary mt-auto">Xem chi tiết</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Gọi hàm khi trang chứa container tương ứng
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("featured-products")) loadFeaturedProducts();
  if (document.getElementById("all-products")) loadAllProducts();
});

// ==== Search Suggest ====
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("searchSuggestions");

if (searchInput) {
  searchInput.addEventListener("input", async () => {
    const keyword = searchInput.value.trim();
    if (keyword.length < 1) {
      suggestionsBox.style.display = "none";
      return;
    }

    const SEARCH_API = `${API_BASE}/products/search?keyword=`;

    try {
      const res = await fetch(`${SEARCH_API}${encodeURIComponent(keyword)}`);
      const products = await res.json();

      if (products.length > 0) {
        suggestionsBox.innerHTML = products.slice(0, 5).map(p => `
          <a href="product.html?id=${p._id}" class="list-group-item list-group-item-action">
            ${p.name}
          </a>
        `).join('');
        suggestionsBox.style.display = "block";
      } else {
        suggestionsBox.style.display = "none";
      }
    } catch (err) {
      console.error("Gợi ý lỗi:", err);
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = "none";
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
    const userData = localStorage.getItem("user");
    const dropdown = document.getElementById("user-info-dropdown");
    const loginLink = document.getElementById("user-login-link");
    const usernameSpan = document.getElementById("username-display");

    if (userData) {
      const user = JSON.parse(userData);
      dropdown.style.display = "block";
      loginLink.style.display = "none";
      usernameSpan.textContent = user.name || "User";

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    } else {
      dropdown.style.display = "none";
      loginLink.style.display = "block";
    }

    // 🔄 Điều hướng theo trạng thái đăng nhập
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name) {
          window.location.href = "checkout.html";
        } else {
          window.location.href = "guest-checkout.html";
        }
      });
    }
  });