// Initialize Appwrite
const client = new Appwrite.Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67dd7787000277407b0a");

const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

// Upload image function
async function uploadImage(file) {
    try {
        console.log("Uploading file:", file.name);
        const response = await storage.createFile("product-images", Appwrite.ID.unique(), file);
        console.log("Upload successful:", response);
        return response.$id;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}

// Add product function
async function addProduct(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const imageInput = document.getElementById("image");

    if (!title || !description || !price) {
        console.error("Missing required product fields");
        return;
    }

    if (!imageInput || imageInput.files.length === 0) {
        console.error("No images selected.");
        return;
    }

    let imageIds = [];
    for (const file of imageInput.files) {
        const fileId = await uploadImage(file);
        if (fileId) imageIds.push(fileId);
    }

    if (imageIds.length === 0) {
        console.error("Image upload failed.");
        return;
    }

    try {
        const response = await databases.createDocument(
            "67dd77fe000d21d01da5", // Database ID
            "67dd782400354e955129", // Collection ID
            Appwrite.ID.unique(),
            {
                title,
                description,
                price,
                images: imageIds, // Store image IDs in an array
            }
        );
        console.log("Product added successfully:", response);
    } catch (error) {
        console.error("Error adding product:", error);
    }
}

document.getElementById("productForm").addEventListener("submit", addProduct);
