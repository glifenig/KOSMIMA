document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    function loadCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <a href="shop-single.html?id=${item.id}" class="text-decoration-none">
                        ${item.title}
                    </a>
                </td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>${item.quantity}</td>
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
