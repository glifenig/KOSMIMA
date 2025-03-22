// ✅ Import Appwrite SDK
const { Client, Databases, Storage } = Appwrite;

// ✅ Initialize Appwrite
const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const databases = new Databases(client);
const storage = new Storage(client);

// ✅ Database & Collection IDs
const databaseID = "67dd77fe000d21d01da5"; // Database ID
const productCollectionID = "67dd782400354e955129"; // Product Collection ID
const userCollectionID = "67de8e8f0022e5645291"; // User Collection ID
const bucketID = "product-images"; // Storage Bucket ID

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    fetchUsers();
    updateCartCount();
});

// ✅ Fetch Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(databaseID, productCollectionID);
        const productList = document.getElementById("productList");

        if (!productList) {
            console.error("Product list container not found!");
            return;
        }

        productList.innerHTML = ""; // Clear previous list

        response.documents.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.innerHTML = `
                <h3>${product.title}</h3>
                <p><strong>Short Description:</strong> ${product.shortDescription}</p>
                <p><strong>Full Description:</strong> ${product.description}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                ${product.image1 && product.image1.length > 0 
                    ? product.image1.map(img => `<img src="${img}" width="100">`).join("") 
                    : "No Images"}
                <br>
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
                <hr>
            `;
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// ✅ Delete Product (Make it Global)
window.deleteProduct = async function (productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        await databases.deleteDocument(databaseID, productCollectionID, productId);
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh product list after deletion
    } catch (error) {
        console.error("Error deleting product:", error);
        alert(`Failed to delete product. Error: ${error.message}`);
    }
};

// ✅ Fetch Users
async function fetchUsers() {
    try {
        const response = await databases.listDocuments(databaseID, userCollectionID);
        const userList = document.getElementById("user-list");

        if (!userList) {
            console.error("User list container not found!");
            return;
        }

        userList.innerHTML = ""; // Clear previous list

        response.documents.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.innerHTML = `<p><strong>${user.name}</strong> - ${user.phone} - ${user.email}</p>`;
            userList.appendChild(userDiv);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// ✅ Update Cart Count
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) {
        console.error("Cart count element not found!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}
