// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Your project ID

const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

// Function to get URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to Fetch and Display Product Details
async function fetchProductDetails() {
    const productId = getQueryParam("id"); // Get product ID from URL

    if (!productId) {
        document.querySelector("p.product-title").innerText = "Product not found.";
        return;
    }

    try {
        const response = await databases.getDocument(
            "67dd77fe000d21d01da5", // ✅ Replace with your Database ID
            "67dd782400354e955129", // ✅ Replace with your Collection ID
            productId
        );

        // Update Product Details
        document.querySelector("p.product-title").innerText = response.title;
        document.querySelector("p.short-description").innerText = response.shortDescription;
        document.querySelector("p.description").innerText = response.description;
        document.querySelector("p.amount").innerText = `$${response.price}`;

        // Fetch images from Appwrite storage bucket
        const imageElements = document.querySelectorAll("img");
        for (let i = 0; i < imageElements.length; i++) {
            if (response.images[i]) {
                let imageUrl = storage.getFilePreview("product-images", response.images[i]);
                imageElements[i].src = imageUrl;
            }
        }

    } catch (error) {
        console.error("Error fetching product details:", error);
        document.querySelector("p.product-title").innerText = "Failed to load product.";
    }
}

// Load product details when page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
