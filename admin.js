const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") 
    .setProject("67dd7787000277407b0a");

const databases = new Appwrite.Databases(client);

const databaseID = "67dd77fe000d21d01da5"; 
const productCollectionID = "67dd782400354e955129"; 
const userCollectionID = "67de8e8f0022e5645291"; 

// Fetch Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(databaseID, productCollectionID);
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

// Add to Cart
function addToCart(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${title} added to cart!`);
}

// Update Cart Count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

// Load Products and Update Cart Count
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartCount();
});
