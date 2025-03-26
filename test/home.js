// Import Appwrite SDK (Ensure this is included in your HTML)
const { Client, Databases, Query, Storage } = Appwrite;

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67dd7787000277407b0a"); // Your Project ID

// Initialize Appwrite Services
const databases = new Databases(client);
const storage = new Storage(client);
const databaseID = "67dd77fe000d21d01da5"; // Your Database ID
const collectionID = "67dd782400354e955129"; // Your Collection ID
const bucketID = "product-images"; // Your Storage Bucket ID

document.addEventListener("DOMContentLoaded", async function () {
    const latestProductsContainer = document.getElementById("latestProducts");
    const cartCount = document.getElementById("cart-count");

    // Update cart count in the navbar
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Fetch latest 3 products from Appwrite
    async function fetchLatestProducts() {
        try {
            const response = await databases.listDocuments(databaseID, collectionID, [
                Query.orderDesc("$createdAt"),
                Query.limit(3),
            ]);

            latestProductsContainer.innerHTML = ""; // Clear previous content

            response.documents.forEach((product) => {
                // Fetch product image from Appwrite Storage
                const productImage = product.image1 && product.image1.length > 0 
                    ? `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${product.image1[0]}/view?project=67dd7787000277407b0a`
                    : 'placeholder.jpg'; // Use a placeholder if no image

                const productDiv = document.createElement("div");
                productDiv.classList.add("col-12", "col-md-4", "mb-4");
                productDiv.innerHTML = `
                    <div style="background-color: whitesmoke;" class="card h-100">
                        <a href="shop-single.html?product=${product.$id}">
                            <img src="${productImage}" class="card-img-top" alt="${product.title}">
                        </a>
                        <div class="card-body">
                            <ul class="list-unstyled d-flex justify-content-between">
                                <li class="text-muted text-right"><strong>₦${product.price.toLocaleString()}</strong></li>
                            </ul>
                            <a href="shop-single.html?product=${product.$id}" class="h2 text-decoration-none text-dark">${product.title}</a>
                            <p class="card-text">${product.shortDescription}</p>
                            <button class="btn btn-primary add-to-cart" 
                                data-id="${product.$id}" 
                                data-title="${product.title}" 
                                data-price="${product.price}" 
                                data-image="${productImage}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;

                latestProductsContainer.appendChild(productDiv);
            });

            // Add event listeners to all "Add to Cart" buttons
            document.querySelectorAll(".add-to-cart").forEach((button) => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    const productTitle = this.getAttribute("data-title");
                    const productPrice = this.getAttribute("data-price");
                    const productImage = this.getAttribute("data-image");

                    addToCart(productId, productTitle, productPrice, productImage);
                });
            });

        } catch (error) {
            console.error("Error fetching latest products:", error);
        }
    }

    // Add product to cart and store in localStorage
    function addToCart(id, title, price, image) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existingProduct = cart.find(item => item.id === id);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increase quantity if already in cart
        } else {
            cart.push({ id, title, price, image, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(`${title} added to cart!`);
    }

    // Initial fetch and update cart count
    fetchLatestProducts();
    updateCartCount();
});
