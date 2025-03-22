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

    // ✅ Add Product Form Submission
    const productForm = document.getElementById("productForm");
    if (productForm) {
        productForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            await addProduct();
        });
    }
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
                ${product.imageUrls && product.imageUrls.length > 0 
                    ? product.imageUrls.map(img => `<img src="${img}" width="100">`).join("") 
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

// ✅ Add Product
async function addProduct() {
    const title = document.getElementById("title").value.trim();
    const shortDescription = document.getElementById("shortDescription").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value.trim());

    if (!title || !shortDescription || !description || isNaN(price)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    let imageUrls = [];

    for (let i = 1; i <= 5; i++) {
        const fileInput = document.getElementById(`image${i}`);
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            try {
                const response = await storage.createFile(bucketID, "unique()", file);
                const fileID = response.$id;
                const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${fileID}/view?project=67dd7787000277407b0a`;
                imageUrls.push(fileUrl);
            } catch (error) {
                console.error(`Error uploading image ${i}:`, error);
            }
        }
    }

    const productData = {
        title,
        shortDescription,
        description,
        price,
        imageUrls
    };

    try {
        const response = await databases.createDocument(databaseID, productCollectionID, "unique()", productData);
        console.log("Product added:", response);
        alert("Product added successfully!");
        document.getElementById("productForm").reset();
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error("Error adding product:", error);
        alert(`Failed to add product. Error: ${error.message}`);
    }
}

// ✅ Delete Product (Global Function)
window.deleteProduct = async function (productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        await databases.deleteDocument(databaseID, productCollectionID, productId);
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh list after deletion
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
