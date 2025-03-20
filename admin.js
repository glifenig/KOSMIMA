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

// Fetch and Display Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(databaseId, collectionId);
        const productsContainer = document.getElementById("productList");

        productsContainer.innerHTML = ""; // Clear previous products

        response.documents.forEach((product) => {
            const productElement = document.createElement("div");
            const imagesHTML = product.images.map(img => `<img src="${img}" alt="${product.name}" width="100">`).join('');
            
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <p>Rating: ${product.rating} ⭐</p>
                <p>Bio: ${product.bio}</p>
                ${imagesHTML}
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
    let price = parseInt(document.getElementById("price").value); // Convert to integer
    let images = document.getElementById("images").files;
    let description = document.getElementById("description").value;
    let bio = document.getElementById("bio").value;
    let rating = parseInt(document.getElementById("rating").value);

    if (isNaN(price) || isNaN(rating)) {
        alert("Price and Rating must be valid numbers.");
        return;
    }

    try {
        let imageUrls = [];
        for (let i = 0; i < Math.min(images.length, 5); i++) { // Limit to 5 images
            const fileUpload = await storage.createFile(bucketId, ID.unique(), images[i]);
            const fileId = fileUpload.$id;
            const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67dadf1b001c8beaaa91`;
            imageUrls.push(imageUrl);
        }

        await databases.createDocument(databaseId, collectionId, ID.unique(), {
            name,
            price,
            images: imageUrls,
            description,
            bio,
            rating
        });

        alert("Product added successfully!");
        document.getElementById("addProductForm").reset();
        fetchProducts();
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Error adding product");
    }
});

// Delete Product
async function deleteProduct(productId) {
    try {
        await databases.deleteDocument(databaseId, collectionId, productId);
        alert("Product deleted successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
    }
}

// Load Products on Page Load
document.addEventListener("DOMContentLoaded", fetchProducts);
