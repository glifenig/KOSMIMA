// Initialize Appwrite SDK
const client = new Appwrite.Client();
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite API endpoint
    .setProject("67dd7787000277407b0a") // Your Appwrite Project ID
    .setKey("standard_4a497e759ed804bf6e0d8dc3d303cb61ede2962fa27ffdf1a8d82317cf5f6448c2a77a827b1c273f487d593eb27fcfa619a0af7c23f0518062aaeacd9fde448040f03f403c734f0636d9596a9864be6ba130f634727ff9e47afd1c931d1d02d16c84c51f302b5741d77499b6d511d44b8d97882367e534d72c7bf43cca7740d9"); // Use an API Key with appropriate permissions

// Function to add a new product
const addProduct = async () => {
    try {
        const productTitle = document.getElementById("productTitle").value;
        const shortDesc = document.getElementById("shortDesc").value;
        const fullDesc = document.getElementById("fullDesc").value;
        const productPrice = parseInt(document.getElementById("productPrice").value);
        
        const files = [
            document.getElementById("image1").files[0],
            document.getElementById("image2").files[0],
            document.getElementById("image3").files[0],
            document.getElementById("image4").files[0],
            document.getElementById("image5").files[0]
        ].filter(file => file !== undefined); 

        if (files.length === 0) {
            throw new Error("At least one image is required.");
        }

        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const response = await storage.createFile("product-images", Appwrite.ID.unique(), file);
                return `https://cloud.appwrite.io/v1/storage/buckets/product-images/files/${response.$id}/view?project=67dd7787000277407b0a`;
            })
        );

        await databases.createDocument(
            "67dd77fe000d21d01da5", // Database ID
            "67dd782400354e955129", // Collection ID
            Appwrite.ID.unique(),
            {
                title: productTitle,
                shortDescription: shortDesc,
                description: fullDesc,
                price: productPrice,
                images: uploadedImages // Storing images as an array
            }
        );

        alert("Product added successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Error adding product: " + error.message);
    }
};

// Function to fetch products
const fetchProducts = async () => {
    try {
        const response = await databases.listDocuments("67dd77fe000d21d01da5", "67dd782400354e955129");
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        response.documents.forEach(product => {
            const productItem = document.createElement("div");
            productItem.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.shortDescription}</p>
                <p>Price: $${product.price}</p>
                <img src="${product.images[0]}" width="100" alt="Product Image">
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Error fetching products: " + error.message);
    }
};

// Function to delete a product
const deleteProduct = async (productId) => {
    try {
        await databases.deleteDocument("67dd77fe000d21d01da5", "67dd782400354e955129", productId);
        alert("Product deleted successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product: " + error.message);
    }
};

// Load products on page load
document.addEventListener("DOMContentLoaded", fetchProducts);
