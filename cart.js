function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsDiv = document.getElementById("cart-items");

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartItemsDiv.innerHTML = "";
    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `
            <img src="${item.image}" width="100">
            <p>${item.title} - $${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
}

// Remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// Proceed to checkout (For Now, Just Clear Cart)
function checkout() {
    alert("Proceeding to checkout...");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
}

// Load cart when page opens
document.addEventListener("DOMContentLoaded", loadCart);
