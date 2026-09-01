// product.js - Product Page Logic

// Import cart functionality (if in the same HTML, can be used directly)
// Or import via <script src="cart.js"></script>

function loadJsonProducts() {
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const container = document.getElementById("productList");

      products.forEach((product) => {
        const article = document.createElement("article");
        article.classList.add("product-article");

        // Let JSON products also have data-attributes.
        article.dataset.id = product.id;
        article.dataset.name = product.name;
        article.dataset.price = product.price;
        article.dataset.image = product.image;

        article.innerHTML = `
          <img class="product-img" src="${product.image} alt="${product.name}">
          <div class="product-info">

            <h3>${product.name}</h3>
    
            ${product.badge ? `<span class="product-list badge">${product.badge}</span>` : ""}
            <p class="product-description">${product.description}</p>
            <p><strong>Price:</strong>${product.price} kr</p>

            <div class="cart-control">
            <button class="minus">-</button>
            <span class="count">1</span>
            <button class="plus">+</button>
            <button class="add-to-cart"> 🛒 ADD TO CART </button>
            </div>

          </div>
        
            `;

        container.appendChild(article);
      });
      //initializeProductArticles();  Note: Delete this line to get rid of the doubled quantity in shopping cart. 
    });
}

function initializeProductArticles() {
  const productArticles = document.querySelectorAll(".product-article");

  productArticles.forEach((article) => {
    // Get product info from data attributes
    const productId =
      article.dataset.id || Math.random().toString(36).substr(2, 9);
    const productName = article.dataset.name;
    const productPrice = parseFloat(article.dataset.price) || 0;
    const productImage = article.dataset.image || "";

    const minusBtn = article.querySelector(".minus");
    const countSpan = article.querySelector(".count");
    const plusBtn = article.querySelector(".plus");
    const addToCartBtn = article.querySelector(".add-to-cart");

    let count = 1;

    countSpan.textContent = count;

    function updateMinusState() {
      if (count <= 1) {
        minusBtn.disabled = true;
        minusBtn.style.opacity = "0.5";
        minusBtn.style.cursor = "not-allowed";
      } else {
        minusBtn.disabled = false;
        minusBtn.style.opacity = "1";
        minusBtn.style.cursor = "pointer";
      }
    }

    updateMinusState();

    // Plus button
    plusBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      count += 1;
      countSpan.textContent = count;
      updateMinusState();
    });

    // Minus button
    minusBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (count > 1) {
        count -= 1;
        countSpan.textContent = count;
        updateMinusState();
      }
    });

    // Add to cart
    addToCartBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      const productImg = article.querySelector(".product-img");
      const productImage = productImg ? productImg.src : "";

      // Create product object
      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: count,
        image: productImage,
      };

      // Add to cart
      cart.addItem(product);

      // Add animation feedback
      const btn = this;
      btn.textContent = "✅ Added";
      btn.style.background = "#28a745";

      setTimeout(() => {
        btn.textContent = "🛒 Add to Cart";
        btn.style.background = "#007bff";
      }, 1500);

      // Show success notification
      showNotification(`Added ${count} ${productName}(s) to cart`);

      // Reset quantity
      count = 1;
      countSpan.textContent = count;
      updateMinusState();
    });
  });

  // Notification function
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
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

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", function () {
  loadJsonProducts();
  initializeProductArticles();
});

// Update cart badge when page loads
document.addEventListener("DOMContentLoaded", function () {
  if (typeof cart !== "undefined") {
    cart.updateCartBadge();
  }
});
