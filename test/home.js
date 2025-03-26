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
    const latestProductsContainer = document.getElementById("latestProducts");

    // Fetch latest 3 products
    async function fetchLatestProducts() {
        try {
            const response = await databases.listDocuments(databaseID, collectionID, [
                Query.orderDesc("$createdAt"),
                Query.limit(3),
            ]);

            latestProductsContainer.innerHTML = ""; // Clear previous content

            response.documents.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("col-12", "col-md-4", "mb-4");

                productDiv.innerHTML = `
                    <div style="background-color: whitesmoke;" class="card h-100">
                        <a href="shop-single.html?product=${product.$id}">
                            <img src="${product.image1 && product.image1.length > 0 ? product.image1[0] : 'placeholder.jpg'}" class="card-img-top" alt="Product Image">
                        </a>
                        <div class="card-body">
                            <ul class="list-unstyled d-flex justify-content-between">
                                <li class="text-muted text-right">$${product.price.toFixed(2)}</li>
                            </ul>
                            <a href="shop-single.html?product=${product.$id}" class="h2 text-decoration-none text-dark">${product.title}</a>
                            <p class="card-text">${product.shortDescription}</p>
                        </div>
                    </div>
                `;

                latestProductsContainer.appendChild(productDiv);
            });
        } catch (error) {
            console.error("Error fetching latest products:", error);
        }
    }

    fetchLatestProducts();
});
