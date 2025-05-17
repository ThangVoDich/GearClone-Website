document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.getElementById("cart-body");
  const totalDisplay = document.getElementById("total-amount");
  tbody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${item.image}" width="80"></td>
      <td>${item.name}</td>
      <td>${item.price.toLocaleString()}đ</td>
      <td>${item.quantity}</td>
      <td><button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">🗑️</button></td>
    `;
    tbody.appendChild(row);
  });

  totalDisplay.textContent = total.toLocaleString() + "đ";
});

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}
