// Initialize Appwrite SDK
const { Client, Databases, Storage } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67dd7787000277407b0a");

const databases = new Databases(client);
const storage = new Storage(client);

const databaseID = "67dd77fe000d21d01da5";
const collectionID = "67dd782400354e955129";
const bucketID = "product-images";

// Ensure DOM is loaded before running script
document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("product-form");
    const productList = document.getElementById("product-list");

    if (!productForm) {
        console.error("Error: Product form not found in the DOM.");
        return;
    }

    // Add Product Event
    productForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = parseInt(document.getElementById("price").value.trim());

        if (!title || !description || isNaN(price)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Upload Images
        let imageUrls = [];
        for (let i = 1; i <= 5; i++) {
            const fileInput = document.getElementById(`image${i}`);
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                try {
                    const response = await storage.createFile(bucketID, 'unique()', file);
                    const fileID = response.$id;
                    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${fileID}/view?project=67dd7787000277407b0a`;
                    imageUrls.push(fileUrl);
                } catch (error) {
                    console.error(`Error uploading image${i}:`, error);
                }
            }
        }

        // Add Product to Database
        try {
            const response = await databases.createDocument(databaseID, collectionID, 'unique()', {
                title,
                description,
                price,
                images: imageUrls // Store image URLs as an array
            });

            console.log("Product added:", response);
            alert("Product added successfully!");
            productForm.reset();
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        }
    });

    // Fetch and Display Products
    async function fetchProducts() {
        try {
            const response = await databases.listDocuments(databaseID, collectionID);
            productList.innerHTML = "";
            response.documents.forEach(product => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    ${product.images.map(img => `<img src="${img}" width="100">`).join("")}
                `;
                productList.appendChild(li);
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    fetchProducts();
});
