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

        // Fetch related products
        fetchRelatedProducts(response.category);

    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById("product-details").innerHTML = "<p>Failed to load product.</p>";
    }
}

// Function to Fetch Related Products
async function fetchRelatedProducts(category) {
    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5", // ✅ Replace with your Database ID
            "67dd782400354e955129", // ✅ Replace with your Collection ID
            [
                Appwrite.Query.equal("category", category), // Filter by category
                Appwrite.Query.limit(4) // Get only 4 products
            ]
        );

        const relatedProductsContainer = document.getElementById("related-products");
        relatedProductsContainer.innerHTML = response.documents.map(product => `
            <div class="p-2 pb-3">
                <div class="product-wap card rounded-0">
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${product.image1[0]}" alt="${product.title}">
                    </div>
                    <div class="card-body">
                        <a href="product.html?id=${product.$id}" class="h3 text-decoration-none">${product.title}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li>${product.shortDescription}</li>
                        </ul>
                        <p class="text-center mb-0">$${product.price}</p>
                    </div>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error fetching related products:", error);
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

// Load product details when page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
