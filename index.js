// Initialize Appwrite (Declared only once)
const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dd7787000277407b0a"); // Your project ID

const databases = new Appwrite.Databases(client);

// Database & Collection IDs
const PRODUCT_DATABASE_ID = "67dd77fe000d21d01da5"; // Product Database ID
const PRODUCT_COLLECTION_ID = "67dd782400354e955129"; // Product Collection ID

const USER_DATABASE_ID = "67dd77fe000d21d01da5"; // User Database ID (Same as product if in same database)
const USER_COLLECTION_ID = "67de8e8f0022e5645291"; // User Collection ID

// ✅ Fetch Products from Database
async function fetchProducts() {
    try {
        const response = await databases.listDocuments(PRODUCT_DATABASE_ID, PRODUCT_COLLECTION_ID);

        if (!response.documents || response.documents.length === 0) {
            console.warn("No products found.");
            return;
        }

        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        response.documents.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            productDiv.innerHTML = `
                <h2>${product.title}</h2>
                <p>${product.shortDescription}</p>
                <img src="${product.image1[0] || 'placeholder.jpg'}" alt="${product.title}" width="200">
                <br>
                <a href="product.html?id=${product.$id}">View Details</a>
                <br>
                <button onclick="addToCart('${product.$id}', '${product.title}', ${product.price}, '${product.image1[0]}')">
                    Add to Cart
                </button>
            `;

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// ✅ Function to Update Cart Count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

// ✅ Function to Add Product to Cart
function addToCart(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // Update cart count
    alert(`${title} added to cart!`);
}

// ✅ Load products and update cart count when page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartCount();
});

// ✅ Check if user details exist in localStorage
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("user-submitted")) {
        document.getElementById("user-details-form").style.display = "none";
    }
});

// ✅ Handle User Form Submission
document.getElementById("userForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    try {
        // Save to Appwrite Database
        await databases.createDocument(USER_DATABASE_ID, USER_COLLECTION_ID, Appwrite.ID.unique(), {
            name,
            phone,
            email
        });

        // Mark as submitted
        localStorage.setItem("user-submitted", "true");

        // Hide the form
        document.getElementById("user-details-form").style.display = "none";

        alert("Your details have been saved!");
    } catch (error) {
        console.error("Error saving user data:", error);
    }
});
