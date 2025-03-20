// Initialize Appwrite SDK
const { Client, Databases, Storage } = Appwrite;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("YOUR_PROJECT_ID"); // Your Appwrite project ID

const databases = new Databases(client);
const storage = new Storage(client);

document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let imageFile = document.getElementById("image").files[0];
    let description = document.getElementById("description").value;

    try {
        // Upload image to Appwrite Storage
        const fileUpload = await storage.createFile("YOUR_BUCKET_ID", "unique()", imageFile);
        const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/YOUR_BUCKET_ID/files/${fileUpload.$id}/view?project=YOUR_PROJECT_ID`;

        // Insert product details into Appwrite Database
        await databases.createDocument("YOUR_DATABASE_ID", "YOUR_COLLECTION_ID", "unique()", {
            name,
            price,
            image: imageUrl,
            description
        });

        alert("Product added successfully!");
        document.getElementById("addProductForm").reset();
    } catch (error) {
        console.error(error);
        alert("Error adding product");
    }
});
