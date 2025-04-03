document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    function loadCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
            cartTotal.textContent = "0";
            return;
        }

        cart.forEach((item, index) => {
            let price = Number(item.price) || 0; // Ensure price is a valid number
            let quantity = Number(item.quantity) || 1; // Ensure quantity is valid
            let itemTotal = price * quantity;
            totalPrice += itemTotal;

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <a href="shop-single.html?product=${item.id}" class="text-decoration-none">
                        ${item.title}
                    </a>
                </td>
                <td>₦${price.toLocaleString()}</td>
                <td>${quantity}</td>
                <td>₦${itemTotal.toLocaleString()}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                </td>
            `;
            cartItemsContainer.appendChild(row);
        });

        cartTotal.textContent = totalPrice.toLocaleString();

        // Attach event listeners to remove buttons
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                removeFromCart(index);
            });
        });
    }

    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }

    loadCart();
});
