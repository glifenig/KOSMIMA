// Initialize Appwrite SDK
const { Client, Storage, Databases } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const storage = new Storage(client);
const databases = new Databases(client);

const databaseID = "67dd77fe000d21d01da5"; // Database ID
const productCollectionID = "67dd782400354e955129"; // Product Collection ID
const userCollectionID = "67de8e8f0022e5645291"; // User Collection ID
const bucketID = "product-images"; // Storage Bucket ID

// Fetch Users
async function fetchUsers() {
    try {
        const response = await databases.listDocuments(databaseID, userCollectionID);
        const userList = document.getElementById("user-list");

        if (!userList) {
            console.error("Error: user-list element is missing in the HTML.");
            return;
        }

        userList.innerHTML = "";
        response.documents.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.innerHTML = `<p><strong>${user.name}</strong> - ${user.phone} - ${user.email}</p>`;
            userList.appendChild(userDiv);
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        alert(`Failed to load users: ${error.message}`);
    }
}

// Fetch and Display Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(databaseID, productCollectionID);
        const productList = document.getElementById("productList");

        if (!productList) {
            console.error("Error: productList element is missing in the HTML.");
            return;
        }

        productList.innerHTML = "";

        response.documents.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.innerHTML = `
                <h3>${product.title}</h3>
                <p><strong>Short Description:</strong> ${product.shortDescription}</p>
                <p><strong>Full Description:</strong> ${product.description}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                ${product.image1 && product.image1.length > 0 ? 
                    product.image1.map(img => `<img src="${img}" width="100">`).join("") 
                    : "No Images"}
                <br>
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
                <hr>
            `;
            productList.appendChild(productDiv);
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        alert(`Failed to load products: ${error.message}`);
    }
}

// Update Cart Count Safely
function updateCartCount() {
    let cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) {
        console.warn("Warning: cart-count element is missing in the HTML.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Ensure DOM Loads Before Running Functions
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("productList")) {
        fetchProducts();
    }
    if (document.getElementById("user-list")) {
        fetchUsers();
    }
    if (document.getElementById("cart-count")) {
        updateCartCount();
    }
});
