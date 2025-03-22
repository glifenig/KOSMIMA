// Initialize Appwrite SDK
const client = new Appwrite.Client();
const databases = new Appwrite.Databases(client);

client.setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('67dd7787000277407b0a');

const cartCount = document.getElementById("cart-count");
const productsContainer = document.getElementById("products-container");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

async function fetchProducts() {
    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5",
            "67dd782400354e955129"
        );
        displayProducts(response.documents);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displayProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${product.image1[0]}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.shortDescription}</p>
            <span>$${product.price}</span>
            <button onclick="addToCart('${product.$id}', '${product.title}', ${product.price}, '${product.image1[0]}')">Add to Cart</button>
            <a href="product.html?id=${product.$id}">View Details</a>
        `;
        productsContainer.appendChild(productElement);
    });
}

function addToCart(id, title, price, image) {
    let item = cart.find(product => product.id === id);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

fetchProducts();
