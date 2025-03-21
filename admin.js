// Initialize Appwrite SDK
const { Client, Storage, Databases } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Your Project ID

const storage = new Storage(client);
const databases = new Databases(client);

const databaseID = "67dd77fe000d21d01da5"; // Your Database ID
const collectionID = "67dd782400354e955129"; // Your Collection ID
const bucketID = "YOUR_BUCKET_ID"; // Replace with your actual storage bucket ID

document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");

    if (!productForm) {
        console.error("Product form not found!");
        return;
    }

    productForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect product details
        const title = document.getElementById("title").value.trim();
        const shortDescription = document.getElementById("shortDescription").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = parseInt(document.getElementById("price").value.trim());

        if (!title || !shortDescription || !description || isNaN(price)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Upload images and store them in an array
        let imageUrls = [];
        for (let i = 1; i <= 5; i++) {
            const fileInput = document.getElementById(`image${i}`);
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                try {
                    const response = await storage.createFile(bucketID, `unique()`, file);
                    const fileID = response.$id;
                    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${fileID}/view?project=67dd7787000277407b0a`;
                    imageUrls.push(fileUrl); // Store in array
                } catch (error) {
                    console.error(`Error uploading image${i}:`, error);
                }
            }
        }

        // Prepare product data
        const productData = {
            title,
            shortDescription,
            description,
            price,
            image1: imageUrls // ✅ Now stored as an array
        };

        console.log("Sending product data:", productData);

        // Add Product to Database
        try {
            const response = await databases.createDocument(databaseID, collectionID, 'unique()', productData);
            console.log("Product added:", response);
            alert("Product added successfully!");
            productForm.reset();
        } catch (error) {
            console.error("Error adding product:", error);
            alert(`Failed to add product. Error: ${error.message}`);
        }
    });
});
