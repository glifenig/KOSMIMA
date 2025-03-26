// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

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
        document.querySelector("p.product-title").innerText = "Product not found.";
        return;
    }

    try {
        const response = await databases.getDocument(
            "67dd77fe000d21d01da5", // ✅ Database ID
            "67dd782400354e955129", // ✅ Collection ID
            productId
        );

        console.log("Product Data:", response); // Debugging: Log the response

        // Update Product Details
        document.querySelector("p.product-title").innerText = response.title || "No title";
        document.querySelector("p.short-description").innerText = response.shortDescription || "No short description";
        document.querySelector("p.description").innerText = response.description || "No description";
        document.querySelector("p.amount").innerText = response.price ? `$${response.price}` : "No price";

        // Convert stored image string to an array
        let imageUrls = response.image1 ? response.image1.split(",") : [];

        // Select all <img> elements
        const imageElements = document.querySelectorAll("img");

        // Assign images to <img> elements
        imageUrls.forEach((img, index) => {
            if (imageElements[index]) {
                imageElements[index].src = img.trim(); // Trim to remove extra spaces
                imageElements[index].alt = `Product Image ${index + 1}`;
            }
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        document.querySelector("p.product-title").innerText = "Failed to load product.";
    }
}

// Load product details when page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
