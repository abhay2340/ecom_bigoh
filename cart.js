window.onload = function () {
    let cartItemsContainer = document.getElementById("cart-items");
  
    // Retrieve cart data from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      // Generate HTML for each cart item
      cartItemsContainer.innerHTML = cart
        .map((item) => {
          return `
            <div class="cart-item">
              <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
              </div>
              <div class="cart-item-details">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <p>Price: ${item.price} INR</p>
              </div>
            </div>
          `;
        })
        .join("");
    }
  
    // Checkout button event listener
    document.getElementById("checkout-button").addEventListener("click", () => {
      alert("Proceed to checkout");
      // Add checkout logic or redirect to checkout page
    });
  };
  