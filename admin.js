// Import Appwrite SDK
const { Client, Databases, Storage, ID } = Appwrite;

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite API Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const databases = new Databases(client);
const storage = new Storage(client);

// Database & Storage IDs
const DATABASE_ID = "67dd77fe000d21d01da5"; // EcommerceDB
const COLLECTION_ID = "67dd782400354e955129"; // Products
const BUCKET_ID = "product-images"; // Storage Bucket

// Function to Upload Images
async function uploadImages(files) {
    let imageUrls = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        try {
            const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
            const fileId = uploadedFile.$id;
            const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=67dd7787000277407b0a`;
            imageUrls.push(imageUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image: " + error.message);
        }
    }

    return imageUrls;
}

// Add Product
document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("title").value;
    const shortDescription = document.getElementById("shortDescription").value;
    const description = document.getElementById("description").value;
    const price = parseInt(document.getElementById("price").value);
    const imageFiles = document.getElementById("images").files;

    if (!name || !price || imageFiles.length === 0) {
        alert("Please fill in all required fields and upload at least one image.");
        return;
    }

    try {
        // Upload images to Appwrite storage
        const imageUrls = await uploadImages(imageFiles);

        // Insert product into Appwrite database
        const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            name,
            shortDescription,
            description,
            price,
            image1: imageUrls[0] || "",
            image2: imageUrls[1] || "",
            image3: imageUrls[2] || "",
            image4: imageUrls[3] || "",
            image5: imageUrls[4] || "",
        });

        alert("Product added successfully!");
        document.getElementById("addProductForm").reset();
        fetchProducts(); // Refresh product list
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Error adding product: " + error.message);
    }
});

// Fetch & Display Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        const productsContainer = document.getElementById("productsContainer");
        productsContainer.innerHTML = "";

        response.documents.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-item");
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.shortDescription}</p>
                <p>Price: $${product.price}</p>
                <div class="product-images">
                    ${product.image1 ? `<img src="${product.image1}" alt="Product Image 1">` : ""}
                    ${product.image2 ? `<img src="${product.image2}" alt="Product Image 2">` : ""}
                    ${product.image3 ? `<img src="${product.image3}" alt="Product Image 3">` : ""}
                    ${product.image4 ? `<img src="${product.image4}" alt="Product Image 4">` : ""}
                    ${product.image5 ? `<img src="${product.image5}" alt="Product Image 5">` : ""}
                </div>
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
            `;
            productsContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Error fetching products: " + error.message);
    }
}

// Delete Product
async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, productId);
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh list
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product: " + error.message);
    }
}

// Load products on page load
document.addEventListener("DOMContentLoaded", fetchProducts);
