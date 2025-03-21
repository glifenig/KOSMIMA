const { Client, Databases, Storage, ID } = Appwrite;

// Initialize Appwrite SDK
const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67dd7787000277407b0a");

const databases = new Databases(client);
const storage = new Storage(client);

const databaseId = "67dd77fe000d21d01da5";
const collectionId = "67dd782400354e955129";
const bucketId = "product-images";

document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const shortDescription = document.getElementById("shortDescription").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseInt(document.getElementById("price").value);

    if (!title || !shortDescription || !description || isNaN(price)) {
        console.error("All fields (title, short description, description, and price) are required.");
        return;
    }

    let imageUrls = [];

    // Upload images and get URLs
    for (let i = 1; i <= 5; i++) {
        const imageInput = document.getElementById(`image${i}`);
        if (imageInput && imageInput.files.length > 0) {
            const imageFile = imageInput.files[0];
            try {
                const fileUpload = await storage.createFile(bucketId, ID.unique(), imageFile);
                const fileId = fileUpload.$id;
                const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67dd7787000277407b0a`;
                imageUrls.push(imageUrl);
            } catch (error) {
                console.error(`Error uploading image ${i}:`, error);
            }
        }
    }

    if (imageUrls.length === 0) {
        console.error("At least one image is required.");
        return;
    }

    // Create document in Appwrite database
    try {
        const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
            title,
            shortDescription,
            description,
            price,
            images: imageUrls // 🔥 Ensure this is an array!
        });

        console.log("Product added successfully:", response);
        alert("Product added successfully!");
        document.getElementById("addProductForm").reset(); // Reset form
    } catch (error) {
        console.error("Error adding product:", error);
    }
});
