// Initialize Appwrite SDK
const { Client, Storage, Databases, Account } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const storage = new Storage(client);
const databases = new Databases(client);
const account = new Account(client);

const databaseID = "67dd77fe000d21d01da5"; // Database ID
const productCollectionID = "67dd782400354e955129"; // Product Collection ID
const userCollectionID = "user_collection_id"; // Replace with actual User Collection ID
const bucketID = "product-images"; // Replace with your storage bucket ID

document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const userList = document.getElementById("userList");

    if (productForm) {
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
                image1: imageUrls
            };

            try {
                await databases.createDocument(databaseID, productCollectionID, 'unique()', productData);
                alert("Product added successfully!");
                productForm.reset();
                fetchProducts();
            } catch (error) {
                console.error("Error adding product:", error);
                alert(`Failed to add product. Error: ${error.message}`);
            }
        });
    }

    async function fetchProducts() {
        try {
            const response = await databases.listDocuments(databaseID, productCollectionID);
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
        }
    }

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

    async function fetchUsers() {
        try {
            const response = await databases.listDocuments(databaseID, userCollectionID);
            userList.innerHTML = "";
            response.documents.forEach((user) => {
                const userDiv = document.createElement("div");
                userDiv.innerHTML = `
                    <h3>${user.name}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <hr>
                `;
                userList.appendChild(userDiv);
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    fetchProducts();
    fetchUsers();
});
