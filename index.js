async function fetchProducts() {
    try {
        const response = await databases.listDocuments(
            "67dd77fe000d21d01da5",
            "67dd782400354e955129"
        );

        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous content

        let productHTML = ""; // Store all products before adding to DOM

        response.documents.forEach(product => {
            productHTML += `
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="card mb-4 product-wap rounded-0" style="background-color: whitesmoke;">
                        <div class="card rounded-0">
                            <img class="card-img rounded-0 img-fluid" src="${product.image1[0]}" alt="${product.title}">
                        </div>
                        <div class="card-body">
                            <a href="shop-single.html?id=${product.$id}" class="h3 text-decoration-none">${product.title}</a>
                            <p class="text-muted">${product.shortDescription}</p>
                            <p class="text-center mb-0">$${product.price}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        productList.innerHTML = productHTML; // Add all products at once

    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("product-list").innerHTML = "<p>Failed to load products.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchProducts);
