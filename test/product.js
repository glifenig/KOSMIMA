// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Your project ID

const databases = new Appwrite.Databases(client);

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

        // Add event listener for Add to Cart button
        document.getElementById("addToCartBtn").addEventListener("click", () => {
            addToCart(productId, response.title, response.price);
        });

        updateCartCount(); // Update cart count when the product page loads

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
function addToCart(id, title, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product is already in cart
    let existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // Update cart counter
    alert("Product added to cart!");
}

// Function to Update Cart Counter
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").innerText = cart.length;
}

// Function to Go Back to Product List
function goBack() {
    window.location.href = "index.html";
}

// Load product details when page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
