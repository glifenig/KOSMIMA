// Initialize Appwrite Client
const client = new Appwrite.Client();
client.setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67dd7787000277407b0a");

const databases = new Appwrite.Databases(client);

// Function to get URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to Fetch and Display Product Details
async function fetchProductDetails() {
    const productId = getQueryParam("id");
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

        // ✅ Ensure elements exist before modifying
        if (document.getElementById("mainImage")) {
            document.getElementById("mainImage").src = response.image1[0];
        }

        if (document.getElementById("title")) {
            document.getElementById("title").innerText = response.title;
        }

        if (document.getElementById("shortDescription")) {
            document.getElementById("shortDescription").innerText = response.shortDescription;
        }

        if (document.getElementById("description")) {
            document.getElementById("description").innerText = response.description;
        }

        if (document.getElementById("price")) {
            document.getElementById("price").innerText = `$${response.price}`;
        }

        // ✅ Fetch other products only if the container exists
        if (document.getElementById("other-products")) {
            fetchOtherProducts(productId);
        } else {
            console.warn("Warning: 'other-products' container not found in HTML.");
        }

    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById("product-details").innerHTML = "<p>Failed to load product.</p>";
    }
}

// Function to Fetch and Display Other Products
async function fetchOtherProducts(currentProductId) {
    const otherProductsContainer = document.getElementById("other-products");

    // ✅ Ensure the container exists
    if (!otherProductsContainer) {
        console.warn("Warning: 'other-products' container not found in HTML.");
        return;
    }

    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5", // ✅ Your Database ID
            "67dd782400354e955129"  // ✅ Your Collection ID
        );

        otherProductsContainer.innerHTML = ""; // Clear previous content

        response.documents.forEach(product => {
            if (product.$id !== currentProductId) { // Exclude current product
                otherProductsContainer.innerHTML += `
                    <div class="col-md-3 p-2">
                        <div class="product-wap card rounded-0">
                            <div class="card rounded-0">
                                <img class="card-img rounded-0 img-fluid" src="${product.image1[0]}" alt="${product.title}">
                            </div>
                            <div class="card-body text-center">
                                <a href="shop-single.html?id=${product.$id}" class="h5 text-decoration-none">${product.title}</a>
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
        otherProductsContainer.innerHTML = "<p>Failed to load products.</p>";
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

// Ensure script runs only after the page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
