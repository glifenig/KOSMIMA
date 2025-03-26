// Appwrite Configuration
const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = "67dd7787000277407b0a";
const DATABASE_ID = "67dd77fe000d21d01da5";
const COLLECTION_ID = "67dd782400354e955129";
const BUCKET_ID = "product-images";
const API_KEY = "standard_4a497e759ed804bf6e0d8dc3d303cb61ede2962fa27ffdf1a8d82317cf5f6448c2a77a827b1c273f487d593eb27fcfa619a0af7c23f0518062aaeacd9fde448040f03f403c734f0636d9596a9864be6ba130f634727ff9e47afd1c931d1d02d16c84c51f302b5741d77499b6d511d44b8d97882367e534d72c7bf43cca7740d9";

// Appwrite SDK Initialization
const { Client, Databases, Storage, Query } = Appwrite;
const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);
const databases = new Databases(client);
const storage = new Storage(client);

// Elements
const latestProductsContainer = document.getElementById("latest-products");
const cartCount = document.getElementById("cart-count");

// Fetch latest 3 products from Appwrite
async function fetchLatestProducts() {
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc("$createdAt"),
            Query.limit(3),
        ]);

        latestProductsContainer.innerHTML = ""; // Clear previous content

        response.documents.forEach(async (product) => {
            let productImage = "placeholder.jpg"; // Default image

            if (product.image1 && product.image1.length > 0) {
                try {
                    const imageResponse = await storage.getFilePreview(BUCKET_ID, product.image1[0]);
                    productImage = imageResponse.href;
                } catch (error) {
                    console.error("Error fetching product image:", error);
                }
            }

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

    } catch (error) {
        console.error("Error fetching latest products:", error);
    }
}

// Add to Cart Function
function addToCart(event) {
    if (event.target.classList.contains("add-to-cart")) {
        const button = event.target;
        const productID = button.dataset.id;
        const productTitle = button.dataset.title;
        const productPrice = parseFloat(button.dataset.price);
        const productImage = button.dataset.image;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingItem = cart.find(item => item.id === productID);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productID,
                title: productTitle,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }
}

// Update Cart Count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchLatestProducts();
    updateCartCount();
    latestProductsContainer.addEventListener("click", addToCart);
});
