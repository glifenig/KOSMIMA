// Initialize Appwrite SDK
const { Client, Databases, Query } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const databases = new Databases(client);

const databaseID = "67dd77fe000d21d01da5"; // Database ID
const collectionID = "67dd782400354e955129"; // Collection ID

document.addEventListener("DOMContentLoaded", async function () {
    const allProductsContainer = document.getElementById("allProducts");

    // Fetch All Products
    async function fetchAllProducts() {
        try {
            const response = await databases.listDocuments(databaseID, collectionID, [
                Query.orderDesc("$createdAt"), // Order by latest
            ]);

            allProductsContainer.innerHTML = ""; // Clear previous content

            response.documents.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("col-md-4");

                productDiv.innerHTML = `
                    <div class="card mb-4 product-wap rounded-0" style="background-color: whitesmoke;">
                        <div class="card rounded-0">
                            <a href="shop-single.html?id=${product.$id}">
                                <img class="card-img rounded-0 img-fluid" src="${product.image1 && product.image1.length > 0 ? product.image1[0] : 'placeholder.jpg'}">
                            </a>
                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="shop-single.html?id=${product.$id}" class="h3 text-decoration-none">${product.title}</a>
                            <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                                <li>${product.shortDescription}</li>
                            </ul>
                            <p class="text-center mb-0">₦${product.price.toLocaleString()}</p>
                        </div>
                    </div>
                `;

                allProductsContainer.appendChild(productDiv);
            });
        } catch (error) {
            console.error("Error fetching all products:", error);
        }
    }

    fetchAllProducts();
});
