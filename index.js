// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Your project ID

const databases = new Appwrite.Databases(client);

// Fetch Products from Database
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5", // ✅ Replace with your Database ID
            "67dd782400354e955129"  // ✅ Replace with your Collection ID
        );

        if (!response.documents || response.documents.length === 0) {
            console.warn("No products found.");
            return;
        }

        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        response.documents.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            productDiv.innerHTML = `
                <h2>${product.title}</h2>
                <p>${product.shortDescription}</p>
                <img src="${product.image1[0] || 'placeholder.jpg'}" alt="${product.title}" width="200">
                <br>
                <a href="product.html?id=${product.$id}">View Details</a>
                <br>
                <button onclick="addToCart('${product.$id}', '${product.title}', ${product.price}, '${product.image1[0]}')">
                    Add to Cart
                </button>
            `;

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to Update Cart Count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

// Function to Add Product to Cart
function addToCart(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // ✅ Update cart count
    alert(`${title} added to cart!`);
}

// Load products and update cart count when page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartCount(); // ✅ Ensure cart count updates on page load
});
