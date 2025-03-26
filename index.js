// Initialize Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // ✅ Replace with your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // ✅ Replace with your Project ID

const databases = new Appwrite.Databases(client);

// Function to Fetch and Display Products
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5", // ✅ Replace with your Database ID
            "67dd782400354e955129"  // ✅ Replace with your Collection ID
        );

        const productList = document.getElementById("product-list"); // ✅ Make sure this exists in your HTML
        productList.innerHTML = ""; // Clear previous content

        response.documents.forEach(product => {
            let productHTML = `
                <div class="col-md-4">
                    <div class="card mb-4 product-wap rounded-0" style="background-color: whitesmoke;">
                        <div class="card rounded-0">
                            <img class="card-img rounded-0 img-fluid" src="${product.image1[0]}" alt="${product.title}">
                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="product.html?id=${product.$id}" class="h3 text-decoration-none">${product.title}</a>
                            <p class="text-muted">${product.shortDescription}</p> <!-- Short Note Added Here -->
                            <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                                <li>M/L/X/XL</li>
                            </ul>
                            <p class="text-center mb-0">$${product.price}</p>
                        </div>
                    </div>
                </div>
            `;

            productList.innerHTML += productHTML;
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("product-list").innerHTML = "<p>Failed to load products.</p>";
    }
}

// Load products when page loads
document.addEventListener("DOMContentLoaded", fetchProducts);
