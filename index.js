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
            productHTML += `<div class="col-md-4">
                        <div class="card mb-4 product-wap rounded-0" style="background-color: whitesmoke;">
                            <div class="card rounded-0">
                                <img class="card-img rounded-0 img-fluid" src="5.png">
                                <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    
                                </div>
                            </div>
                            <div class="card-body">
                                <a href="shop-single.html" class="h3 text-decoration-none">Oupidatat non</a>
                                <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                                    <li>M/L/X/XL</li>

                                </ul>
                                
                                <p class="text-center mb-0">$250.00</p>
                            </div>
                        </div>
                    </div>`;
        });

        productList.innerHTML = productHTML; // Add all products at once

    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("product-list").innerHTML = "<p>Failed to load products.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchProducts);
