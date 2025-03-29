// Initialize Appwrite SDK
const { Client, Databases, Query } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const databases = new Databases(client);

const databaseID = "67dd77fe000d21d01da5"; // Database ID
const collectionID = "67dd782400354e955129"; // Collection ID

document.addEventListener("DOMContentLoaded", async function () {
    const latestProductsContainer = document.getElementById("latestProducts");
    const cartCount = document.getElementById("cart-count");

    // Update Cart Counter
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Fetch latest 3 products
    async function fetchLatestProducts() {
        try {
            const response = await databases.listDocuments(databaseID, collectionID, [
                Query.orderDesc("$createdAt"),
                Query.limit(3),
            ]);

            latestProductsContainer.innerHTML = ""; // Clear previous content

            response.documents.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("col-12", "col-md-4", "mb-4");

                productDiv.innerHTML = `
                    <div style="background-color: whitesmoke;" class="card h-100">
                        <a href="shop-single.html?id=${product.$id}">
                            <img src="${product.image1 && product.image1.length > 0 ? product.image1[0] : 'placeholder.jpg'}" class="card-img-top" alt="Product Image">
                        </a>
                        <div class="card-body">
                            <ul class="list-unstyled d-flex justify-content-between">
                                <li class="text-muted text-right"><strong>₦${product.price.toLocaleString()}</strong></li>
                            </ul>
                           <a href="shop-single.html?id=${product.$id}" class="h2 text-decoration-none text-dark">${product.title}</a>
                            <p class="card-text">${product.shortDescription}</p>
                            <button class="mbr-section-btn"><a class='btn btn-md btn-secondary-outline display-4" data-id="${product.$id}" data-title="${product.title}" data-price="${product.price}">Add to Cart</button>
                        </div>
                    </div>
                `;

                latestProductsContainer.appendChild(productDiv);
            });

            // Attach event listeners to "Add to Cart" buttons
            document.querySelectorAll(".add-to-cart").forEach((button) => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    const productTitle = this.getAttribute("data-title");
                    const productPrice = this.getAttribute("data-price");

                    addToCart(productId, productTitle, productPrice);
                });
            });
        } catch (error) {
            console.error("Error fetching latest products:", error);
        }
    }

    function addToCart(id, title, price) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if item is already in cart
        let existingProduct = cart.find(item => item.id === id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id, title, price, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount(); // Update cart count
        alert(`${title} added to cart!`);
    }

    fetchLatestProducts();
    updateCartCount(); // Load cart count on page load
});
