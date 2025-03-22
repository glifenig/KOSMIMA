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
const userCollectionID = "67de8e8f0022e5645291"; // Replace with your actual Users Collection ID
const bucketID = "product-images"; // Storage Bucket ID

document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const userList = document.getElementById("userList");

    if (!productForm) {
        console.error("Product form not found!");
        return;
    }

    // Add Product
    productForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const shortDescription = document.getElementById("shortDescription").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = parseInt(document.getElementById("price").value.trim());

        if (!title || !shortDescription || !description || isNaN(price)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Upload images and store in an array
        let imageUrls = [];
        for (let i = 1; i <= 5; i++) {
            const fileInput = document.getElementById(`image${i}`);
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                try {
                    const response = await storage.createFile(bucketID, `unique()`, file);
                    const fileID = response.$id;
                    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${fileID}/view?project=67dd7787000277407b0a`;
                    imageUrls.push(fileUrl);
                } catch (error) {
                    console.error(`Error uploading image${i}:`, error);
                }
            }
        }

        const productData = {
            title,
            shortDescription,
            description,
            price,
            imageUrls // Now correctly storing images
        };

        console.log("Sending product data:", productData);

        try {
            const response = await databases.createDocument(databaseID, productCollectionID, 'unique()', productData);
            console.log("Product added:", response);
            alert("Product added successfully!");
            productForm.reset();
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error("Error adding product:", error);
            alert(`Failed to add product. Error: ${error.message}`);
        }
    });

    // Fetch and display products
    async function fetchProducts() {
        try {
            const response = await databases.listDocuments(databaseID, productCollectionID);
            productList.innerHTML = ""; // Clear previous list

            response.documents.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.innerHTML = `
                    <h3>${product.title}</h3>
                    <p><strong>Short Description:</strong> ${product.shortDescription}</p>
                    <p><strong>Full Description:</strong> ${product.description}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    ${product.imageUrls && product.imageUrls.length > 0 ? 
                        product.imageUrls.map(img => `<img src="${img}" width="100">`).join("") 
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

    // Delete Product
    window.deleteProduct = async function (productId) {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await databases.deleteDocument(databaseID, productCollectionID, productId);
            alert("Product deleted successfully!");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(`Failed to delete product. Error: ${error.message}`);
        }
    };

    // Fetch and display users
    async function fetchUsers() {
        try {
            const response = await databases.listDocuments(databaseID, userCollectionID);
            userList.innerHTML = ""; // Clear previous data

            response.documents.forEach((user) => {
                const userDiv = document.createElement("div");
                userDiv.innerHTML = `
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone || "N/A"}</p>
                    <hr>
                `;
                userList.appendChild(userDiv);
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    fetchProducts(); // Load products on page load
    fetchUsers(); // Load users on page load
});
