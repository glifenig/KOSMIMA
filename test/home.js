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

const cartCount = document.getElementById("cart-count");



// Update Cart Counter

function updateCartCount() {

}



// Fetch latest 3 products

async function fetchLatestProducts() {

}



function addToCart(id, title, price) {

}



fetchLatestProducts();

updateCartCount(); // Load cart count on page load

});
