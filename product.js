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

        const productDetails = document.getElementById("product-details");

        // Generate HTML for all product images
        let imagesHTML = "";
        if (response.image1 && response.image1.length > 0) {
            imagesHTML = response.image1.map(img => `<img src="${img}" alt="${response.title}" width="300">`).join("");
        }

        // Display product details
        productDetails.innerHTML = `
            <h2>${response.title}</h2>
            <div>${imagesHTML}</div>
            <p><strong>Short Description:</strong> ${response.shortDescription}</p>
            <p><strong>Description:</strong> ${response.description}</p>
            <p><strong>Price:</strong> $${response.price}</p>
            <p><strong>Category:</strong> ${response.category}</p>
            <p><strong>Tags:</strong> ${response.tags ? response.tags.join(", ") : "No tags"}</p>
            <button onclick="addToCart('${response.$id}', '${response.title}', ${response.price}, '${response.image1[0]}')">Add to Cart</button>
        `;
    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById("product-details").innerHTML = "<p>Failed to load product.</p>";
    }
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
    alert(`${title} added to cart!`);
}

// Function to Go Back to Product List
function goBack() {
    window.location.href = "index.html";
}

// Load product details when page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
