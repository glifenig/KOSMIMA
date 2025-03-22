// index.js

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartCount = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();

    async function fetchProducts() {
        try {
            const response = await databases.listDocuments("67dd77fe000d21d01da5", "67dd782400354e955129");
            displayProducts(response.documents);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function displayProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-item");
            productElement.innerHTML = `
                <img src="${product.image1[0]}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.shortDescription}</p>
                <span>$${product.price}</span>
                <button class="add-to-cart" data-id="${product.$id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image1[0]}">Add to Cart</button>
            `;
            productList.appendChild(productElement);
        });
        attachCartEventListeners();
    }

    function attachCartEventListeners() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                const title = event.target.getAttribute("data-title");
                const price = event.target.getAttribute("data-price");
                const image = event.target.getAttribute("data-image");
                addToCart({ id, title, price, image });
            });
        });
    }

    function addToCart(product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    fetchProducts();
});
