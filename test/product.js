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
            "67dd77fe000d21d01da5", // ✅ Your Database ID
            "67dd782400354e955129", // ✅ Your Collection ID
            productId
        );

        // Set main product details
        document.getElementById("mainImage").src = response.image1[0];
        document.getElementById("title").innerText = response.title;
        document.getElementById("shortDescription").innerText = response.shortDescription;
        document.getElementById("description").innerText = response.description;
        document.getElementById("price").innerText = `$${response.price}`;

        // Generate thumbnail images
        const thumbnailsContainer = document.getElementById("thumbnails");
        thumbnailsContainer.innerHTML = response.image1.map(img =>
            `<img src="${img}" class="thumbnail" onclick="changeMainImage('${img}')">`
        ).join("");

        // Fetch other products
        fetchOtherProducts(productId);

    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById("product-details").innerHTML = "<p>Failed to load product.</p>";
    }
}

// Function to Fetch and Display Other Products
async function fetchOtherProducts(currentProductId) {
    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5", // ✅ Your Database ID
            "67dd782400354e955129"  // ✅ Your Collection ID
        );

        const otherProductsContainer = document.getElementById("other-products");
        otherProductsContainer.innerHTML = "";

        response.documents.forEach(product => {
            if (product.$id !== currentProductId) { // Exclude current product
                otherProductsContainer.innerHTML += `
                    <div class="col-md-3 p-2">
                        <div class="product-wap card rounded-0">
                            <div class="card rounded-0">
                                <img class="card-img rounded-0 img-fluid" src="${product.image1[0]}" alt="${product.title}">
                            </div>
                            <div class="card-body text-center">
                                <a href="product.html?id=${product.$id}" class="h5 text-decoration-none">${product.title}</a>
                                <p class="small">${product.shortDescription}</p>
                                <p class="text-center font-weight-bold">$${product.price}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

    } catch (error) {
        console.error("Error fetching other products:", error);
        document.getElementById("other-products").innerHTML = "<p>Failed to load products.</p>";
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
