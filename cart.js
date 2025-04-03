document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

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

        totalPrice += 2000; // Add ₦2000 charge
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

    function payWithFlutterwave() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 2000;
        let userEmail = prompt("Enter your email:");
        let userPhone = prompt("Enter your phone number:");
        let fullName = prompt("Enter your full name:");

        if (!userEmail || !userPhone || !fullName) {
            alert("All details are required!");
            return;
        }

        FlutterwaveCheckout({
            public_key: "YOUR_FLUTTERWAVE_PUBLIC_KEY",
            tx_ref: "TX" + Date.now(),
            amount: totalPrice,
            currency: "NGN",
            payment_options: "card, mobilemoney, ussd",
            customer: {
                email: userEmail,
                phone_number: userPhone,
                name: fullName,
            },
            callback: function (response) {
                if (response.status === "successful") {
                    sendOrderDetails(userEmail, userPhone, fullName, cart, totalPrice);
                    localStorage.removeItem("cart"); // Clear cart after payment
                    alert("Payment Successful! Check your email for order confirmation.");
                    window.location.href = "thank-you.html";
                }
            },
            customizations: {
                title: "GoodLife Tech Store",
                description: "Payment for items in cart",
                logo: "https://your-logo-url.com/logo.png",
            },
        });
    }

    function sendOrderDetails(email, phone, name, cart, totalPrice) {
        fetch("https://your-server.com/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                phone,
                name,
                cart,
                totalPrice,
            }),
        })
            .then(response => response.json())
            .then(data => console.log("Email sent:", data))
            .catch(error => console.error("Error sending email:", error));
    }

    checkoutBtn.addEventListener("click", payWithFlutterwave);
    loadCart();
});
