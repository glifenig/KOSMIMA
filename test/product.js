// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Your project ID

const databases = new Appwrite.Databases(client);

// Function to get URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to Fetch and Display Product Details
async function fetchProductDetails() {
    const productId = getQueryParam("id"); // Get product ID from URL

    if (!productId) {
        document.getElementById("product-details").innerHTML = "<p>Product not found.</p>";
        return;
    }

    try {
        const response = await databases.getDocument(
            "67dd77fe000d21d01da5", // ✅ Replace with your Database ID
            "67dd782400354e955129", // ✅ Replace with your Collection ID
            productId
        );

        // Set main image
        document.getElementById("mainImage").src = response.image1[0];

        // Generate thumbnail images
        const thumbnailsContainer = document.getElementById("thumbnails");
        thumbnailsContainer.innerHTML = response.image1.map(img => 
            `<img src="${img}" class="thumbnail" onclick="changeMainImage('${img}')">`
        ).join("");

        // Set product details
        document.getElementById("title").innerText = response.title;
        document.getElementById("shortDescription").innerText = response.shortDescription;
        document.getElementById("description").innerText = response.description;
        document.getElementById("price").innerText = response.price;

    } catch (error) {
        console.error("Error fetching
