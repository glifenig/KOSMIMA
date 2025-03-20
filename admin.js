// Initialize Appwrite SDK
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // API Endpoint
    .setProject("67dadf1b001c8beaaa91"); // Project ID

const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);
const ID = Appwrite.ID;

const databaseId = "67dc232d000c5295ee23"; // EcommerceDB Database ID
const collectionId = "Products"; // Collection ID
const bucketId = "67dc258000056ec47ca5"; // ProductImages Bucket ID

// Function to Fetch and Display Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(databaseId, collectionId);
        const productsContainer = document.getElementById("productList");

        productsContainer.innerHTML = ""; // Clear previous products

        response.documents.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <img src="${product.image}" alt="${product.name}" width="100">
                <p>${product.description}</p>
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
                <hr>
            `;
            productsContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Form Submission - Add Product
document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let price = parseInt(document.getElementById("price").value); // ✅ Convert to integer
    let imageFile = document.getElementById("image").files[0];
    let description = document.getElementById("description").value;

    if (isNaN(price)) {
        alert("Price must be a valid number.");
        return;
    }

    try {
        // ✅ Use `ID.unique()` for valid file ID
        const fileUpload = await storage.createFile(bucketId, ID.unique(), imageFile);
        const fileId = fileUpload.$id;

        // ✅ Correct Image URL Format
        const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67dadf1b001c8beaaa91`;

        // ✅ Insert product with integer price
        await databases.createDocument(databaseId, collectionId, ID.unique(), {
            name,
            price, // Now correctly formatted as an integer
            image: imageUrl,
            description
        });

        alert("Product added successfully!");
        document.getElementById("addProductForm").reset();
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Error adding product");
    }
});

// Function to Delete Product
async function deleteProduct(productId) {
    try {
        await databases.deleteDocument(databaseId, collectionId, productId);
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
    }
}

// Load Products on Page Load
document.addEventListener("DOMContentLoaded", fetchProducts);
