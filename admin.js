// Initialize Appwrite SDK
const { Client, Databases, Storage } = Appwrite;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
    .setProject("67dadf1b001c8beaaa91"); // Replace with your project ID

const databases = new Databases(client);
const storage = new Storage(client);

const databaseId = "67dc232d000c5295ee23"; // Replace with your Database ID
const collectionId = "Products"; // Replace with your Collection ID
const bucketId = "67dc258000056ec47ca5"; // Replace with your Storage Bucket ID

// Form Submission - Add Product
document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let imageFile = document.getElementById("image").files[0];
    let description = document.getElementById("description").value;

    try {
        // Upload image to Appwrite Storage
        const fileUpload = await storage.createFile(bucketId, ID.unique(), imageFile);
        const fileId = fileUpload.$id;
        const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67dadf1b001c8beaaa91`;

        // Insert product details into Appwrite Database
        await databases.createDocument(databaseId, collectionId, ID.unique(), {
            name,
            price,
            image: imageUrl,
            description
        });

        alert("Product added successfully!");
        document.getElementById("addProductForm").reset();
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error(error);
        alert("Error adding product");
    }
});

// Fetch & Display Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(databaseId, collectionId);
        const products = response.documents;

        let productList = document.getElementById("productList");
        productList.innerHTML = ""; // Clear list before adding new items

        products.forEach(product => {
            let li = document.createElement("li");
            li.innerHTML = `
                <img src="${product.image}" width="100" alt="Product Image">
                <p><strong>${product.name}</strong></p>
                <p>Price: $${product.price}</p>
                <p>${product.description}</p>
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
            `;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Delete Product
async function deleteProduct(productId) {
    try {
        await databases.deleteDocument(databaseId, collectionId, productId);
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

// Load products on page load
fetchProducts();
