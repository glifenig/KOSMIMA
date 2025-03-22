const client = new Appwrite.Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67dd7787000277407b0a');

const databases = new Appwrite.Databases(client);

document.addEventListener('DOMContentLoaded', fetchProducts);

async function fetchProducts() {
    try {
        const response = await databases.listDocuments(
            '67dd77fe000d21d01da5', 
            '67dd782400354e955129'
        );

        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        response.documents.forEach(product => {
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <h2>${product.title}</h2>
                <p>${product.shortDescription}</p>
                <img src="${product.image1[0]}" alt="${product.title}" width="200">
                <a href="product.html?id=${product.$id}">View Details</a>
            `;
            productList.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
