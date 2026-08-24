// cart-page.js - Shopping Cart Page Rendering Logic

document.addEventListener("DOMContentLoaded", function () {
  renderCart();

  // Clear cart
  document
    .getElementById("clearCartBtn")
    .addEventListener("click", function () {
      if (confirm("Are you sure you want to clear the cart?")) {
        cart.clearCart();
        renderCart();
        showNotification("Cart has been cleared");
      }
    });

  // Checkout button
  document.getElementById("checkoutBtn").addEventListener("click", function () {
    if (cart.items.length === 0) {
      showNotification("Your cart is empty!", "warning");
      return;
    }

    const total = cart.getTotal();
    const items = cart.getTotalItems();
    alert(
      `🎉 Order submitted!\n\nItems: ${items}\nTotal: ${total.toFixed(2)}\n\nThank you for your purchase!`,
    );

    // Redirect to payment page
    // window.location.href = 'checkout.html';
  });
});

// Render cart
function renderCart() {
  const container = document.getElementById("cartItems");
  const items = cart.items;

  if (items.length === 0) {
    container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Start adding some items!</p>
                <a href="product.html" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 6px;">Start Shopping</a>
            </div>
        `;
    updateSummary();
    return;
  }

  // Render item list
  let html = "";
  items.forEach((item) => {
    const subtotal = item.price * item.quantity;
    html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image || "https://via.placeholder.com/100"}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">SEK ${item.name}</div>
                    <div class="cart-item-price">SEK ${item.price.toFixed(2)}</div>
                    <div class="cart-item-subtotal">Subtotal: SEK ${subtotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-qty" ${item.quantity <= 1 ? "disabled" : ""}>-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-qty">+</button>
                    <button class="remove-item" title="Remove item">✕</button>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;

  // Bind events
  container.querySelectorAll(".cart-item").forEach((itemElement) => {
    const id = itemElement.dataset.id;
    const decreaseBtn = itemElement.querySelector(".decrease-qty");
    const increaseBtn = itemElement.querySelector(".increase-qty");
    const removeBtn = itemElement.querySelector(".remove-item");

    // Decrease quantity
    decreaseBtn.addEventListener("click", function () {
      const item = cart.items.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        cart.updateQuantity(id, item.quantity - 1);
        renderCart();
      }
    });

    // Increase quantity
    increaseBtn.addEventListener("click", function () {
      const item = cart.items.find((i) => i.id === id);
      if (item) {
        cart.updateQuantity(id, item.quantity + 1);
        renderCart();
      }
    });

    // Remove item
    removeBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to remove this item?")) {
        cart.removeItem(id);
        renderCart();
        showNotification("Item removed");
      }
    });
  });

  updateSummary();
}

// Update summary information
function updateSummary() {
  const subtotal = cart.getSubtotal();
  const shipping = cart.getShipping();
  const total = cart.getTotal();
  const totalItems = cart.getTotalItems();

  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("subtotal").textContent =
    `SEK ${subtotal.toFixed(2)}`;

  // Display shipping info
  const shippingEl = document.getElementById("shipping");
  if (shipping === 0 && subtotal > 0) {
    shippingEl.innerHTML =
      'SEK 0.00 <span class="free-shipping">🎉 Free Shipping</span>';
  } else {
    shippingEl.textContent = `SEK ${shipping.toFixed(2)}`;
  }

  document.getElementById("total").textContent = `SEK ${total.toFixed(2)}`;
}

// Notification function (consistent with product page)
function showNotification(message, type = "success") {
  const colors = {
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
  };

  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: ${type === "warning" ? "#333" : "white"};
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-size: 16px;
        max-width: 400px;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
