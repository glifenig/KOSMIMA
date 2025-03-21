document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");

    async function fetchProducts() {
        try {
            const response = await databases.listDocuments("67dd77fe000d21d01da5", "67dd782400354e955129");
            return response.documents;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    function renderProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            
            productCard.innerHTML = `
                <img src="${product.image1[0]}" alt="${product.title}" class="product-image">
                <h3>${product.title}</h3>
                <p>${product.shortDescription}</p>
                <p>Price: $${product.price}</p>
                <button onclick="viewProduct('${product.$id}')">View Details</button>
                <button onclick="addToCart('${product.$id}', '${product.title}', ${product.price}, '${product.image1[0]}')">Add to Cart</button>
            `;
            
            productList.appendChild(productCard);
        });
    }

    window.viewProduct = (productId) => {
        window.location.href = `product.html?id=${productId}`;
    };

    window.addToCart = (id, title, price, image) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ id, title, price, image });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    };

    const products = await fetchProducts();
    renderProducts(products);
});
