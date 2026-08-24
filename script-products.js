

const productArticles = document.querySelectorAll(".product-article");


productArticles.forEach((article) => {
  const productName = article.dataset.name;
  const minusBtn = article.querySelector(".minus");
  const countSpan = article.querySelector(".count");
  const plusBtn = article.querySelector(".plus");
  const addToCartBtn = article.querySelector(".add-to-cart");

  let count = 1;

  countSpan.textContent = count;

  function updateMinusState() {
    if (count <= 1) {
      minusBtn.disabled = true;
    } else {
      minusBtn.disabled = false;
    }
  }

  updateMinusState();

  // =========== plusButtons ===========

  plusBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    count += 1;
    countSpan.textContent = count;
    updateMinusState();
  });

  // ========= minusButtons =========

  minusBtn.addEventListener("click", function (e) {
    e.stopPropagation();

    if (count > 1) {
      count -= 1;
      countSpan.textContent = count;
      updateMinusState(); // if count<=1, minusButton is disabled.
    }
  });

  // ========= ADD TO CART =========
  addToCartBtn.addEventListener("click", function (e) {
    e.stopPropagation();

    alert(`You have added to cart: ${productName}`);
  });
});


