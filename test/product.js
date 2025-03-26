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
        document.getElementById("product-title").innerText = "Product not found.";
        return;
    }

    try {
        const response = await databases.getDocument(
            "67dd77fe000d21d01da5", // ✅ Replace with your Database ID
            "67dd782400354e955129", // ✅ Replace with your Collection ID
            productId
        );

        // Update Product Details
        document.getElementById("product-title").innerText = response.title;
        document.getElementById("product-price").innerText = `$${response.price}`;
        document.getElementById("short-description").innerText = response.shortDescription;
        document.getElementById("long-description").innerText = response.description;

        // Set Main Image
        if (response.image1.length > 0) {
            document.getElementById("product-detail").src = response.image1[0];
        }

        // Populate the Image Carousel
        let carouselInner = document.querySelector(".carousel-inner");
        carouselInner.innerHTML = ""; // Clear existing content

        response.image1.forEach((imageUrl, index) => {
            let isActive = index === 0 ? "active" : "";
            let itemHtml = `
                <div class="carousel-item ${isActive}">
                    <div class="row">
                        <div class="col-4">
                            <a href="#"><img class="card-img img-fluid" src="${imageUrl}" alt="Product Image ${index + 1}"></a>
                        </div>
                    </div>
                </div>
            `;
            carouselInner.innerHTML += itemHtml;
        });

        // Update Add to Cart button
        document.getElementById("add-to-cart").setAttribute(
            "onclick",
            `addToCart('${response.$id}', '${response.title}', ${response.price}, '${response.image1[0]}')`
        );

    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById("product-title").innerText = "Failed to load product.";
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

// Load product details when page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
