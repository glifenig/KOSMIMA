// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Your project ID

const databases = new Appwrite.Databases(client);

document.addEventListener("DOMContentLoaded", async function () {
    const cartCount = document.getElementById("cart-count");

        // Update Cart Counter
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
// Function to get URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to Fetch and Display Product Details
async function fetchProductDetails() {
    const productId = getQueryParam("id"); // Get product ID from URL

    if (!productId) {
        document.getElementById("product-details").innerHTML = "<p>Product not found.</p>";
        return;
    }

    try {
        const response = await databases.getDocument(
            "67dd77fe000d21d01da5", // ✅ Replace with your Database ID
            "67dd782400354e955129", // ✅ Replace with your Collection ID
            productId
        );

        // Set main image
        document.getElementById("mainImage").src = response.image1[0];

        // Generate thumbnail images
        const thumbnailsContainer = document.getElementById("thumbnails");
        thumbnailsContainer.innerHTML = response.image1.map(img => 
            `<img src="${img}" class="thumbnail" onclick="changeMainImage('${img}')">`
        ).join("");

        // Set product details
        document.getElementById("title").innerText = response.title;
        document.getElementById("shortDescription").innerText = response.shortDescription;
        document.getElementById("description").innerText = response.description;
        document.getElementById("price").innerText = response.price;

    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById("product-details").innerHTML = "<p>Failed to load product.</p>";
    }
}

// Function to Change Main Image
function changeMainImage(imageUrl) {
    document.getElementById("mainImage").src = imageUrl;
}

// Function to Add Product to Cart
function addToCart() {
    alert("Product added to cart!");
}

// Function to Go Back to Product List
function goBack() {
    window.location.href = "index.html";
}

     // Attach event listeners to "Add to Cart" buttons
            document.querySelectorAll(".add-to-cart").forEach((button) => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    const productTitle = this.getAttribute("data-title");
                    const productPrice = this.getAttribute("data-price");

                    addToCart(productId, productTitle, productPrice);
                });
            });

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

// Load product details when page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
            updateCartCount(); // Load cart count on page load
