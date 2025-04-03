document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    function loadCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
            cartTotal.textContent = "0";
            return;
        }

        let totalPrice = 0;

        cart.forEach((item, index) => {
            let row = document.createElement("tr");

            let itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            row.innerHTML = `
                <td>${item.title}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>
                    <button class="decrease" data-index="${index}">-</button>
                    ${item.quantity}
                    <button class="increase" data-index="${index}">+</button>
                </td>
                <td>₦${itemTotal.toLocaleString()}</td>
                <td><button class="remove" data-index="${index}">Remove</button></td>
            `;

            cartItemsContainer.appendChild(row);
        });

        cartTotal.textContent = totalPrice.toLocaleString();

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", function () {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                let index = this.getAttribute("data-index");
                cart[index].quantity += 1;
                localStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
            });
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", function () {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                let index = this.getAttribute("data-index");

                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1); // Remove item if quantity is 1
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
            });
        });

        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", function () {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                let index = this.getAttribute("data-index");

                cart.splice(index, 1); // Remove item from cart
                localStorage.setItem("cart", JSON.stringify(cart));
                loadCart();
            });
        });
    }

    document.getElementById("checkout-btn").addEventListener("click", function () {
        alert("Checkout feature coming soon!");
    });

    loadCart();
});
