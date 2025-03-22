// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Your project ID

const databases = new Appwrite.Databases(client);

async function fetchProducts() {
    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5", // Database ID
            "67dd782400354e955129"  // Collection ID
        );

        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous content

        response.documents.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            productDiv.innerHTML = `
                <h2>${product.title}</h2>
                <p>${product.shortDescription}</p>
                <img src="${product.image1[0]}" alt="${product.title}" width="200">
                <br>
                <a href="product.html?id=${product.$id}">View Details</a>
            `;

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Load products when page loads
document.addEventListener("DOMContentLoaded", fetchProducts);
