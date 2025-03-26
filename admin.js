// Initialize Appwrite SDK
const { Client, Storage, Databases } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const storage = new Storage(client);
const databases = new Databases(client);

const databaseID = "67dd77fe000d21d01da5"; // Database ID
const collectionID = "67dd782400354e955129"; // Collection ID
const bucketID = "product-images"; // Storage bucket ID

document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");

    if (!productForm) {
        console.error("Product form not found!");
        return;
    }

    // Function to upload a file and return the URL
    async function uploadFile(file) {
        if (!file) return ""; // Return empty string if no file is uploaded
        try {
            const response = await storage.createFile(bucketID, 'unique()', file);
            return `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${response.$id}/view?project=67dd7787000277407b0a`;
        } catch (error) {
            console.error(`Error uploading file:`, error);
            return "";
        }
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

        // Upload images one by one
        const image1 = await uploadFile(document.getElementById("image1").files[0]);
        const image2 = await uploadFile(document.getElementById("image2").files[0]);
        const image3 = await uploadFile(document.getElementById("image3").files[0]);
        const image4 = await uploadFile(document.getElementById("image4").files[0]);
        const image5 = await uploadFile(document.getElementById("image5").files[0]);

        const productData = {
            title,
            shortDescription,
            description, 
            price,
            image1, 
            image2, 
            image3, 
            image4, 
            image5
        };

        console.log("Sending product data:", productData);

        // Add product to database
        try {
            const response = await databases.createDocument(databaseID, collectionID, 'unique()', productData);
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
            const response = await databases.listDocuments(databaseID, collectionID);
            productList.innerHTML = ""; // Clear previous list

            response.documents.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.innerHTML = `
                    <h3>${product.title}</h3>
                    <p><strong>Short Description:</strong> ${product.shortDescription}</p>
                    <p><strong>Full Description:</strong> ${product.description}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    
                    <div>
                        <strong>Product Images:</strong><br>
                        ${product.image1 ? `<img src="${product.image1}" width="150" alt="Image 1"><br>` : ""}
                        ${product.image2 ? `<img src="${product.image2}" width="150" alt="Image 2"><br>` : ""}
                        ${product.image3 ? `<img src="${product.image3}" width="150" alt="Image 3"><br>` : ""}
                        ${product.image4 ? `<img src="${product.image4}" width="150" alt="Image 4"><br>` : ""}
                        ${product.image5 ? `<img src="${product.image5}" width="150" alt="Image 5"><br>` : ""}
                    </div>
                    
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
            await databases.deleteDocument(databaseID, collectionID, productId);
            alert("Product deleted successfully!");
            fetchProducts(); // Refresh list after deletion
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(`Failed to delete product. Error: ${error.message}`);
        }
    };

    fetchProducts(); // Load products on page load
});
