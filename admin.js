// Initialize Appwrite SDK
const client = new Appwrite.Client();
const database = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67dd7787000277407b0a');

const databaseId = '67dd77fe000d21d01da5';
const collectionId = '67dd782400354e955129';
const bucketId = 'product-images';

// Function to add a product
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = parseInt(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const shortDescription = document.getElementById('shortDescription').value;
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value.split(',');
    
    const imageFiles = document.getElementById('images').files;
    let imageUrls = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        try {
            const response = await storage.createFile(bucketId, Appwrite.ID.unique(), file);
            const fileId = response.$id;
            const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67dd7787000277407b0a`;
            imageUrls.push(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
    
    try {
        await database.createDocument(databaseId, collectionId, Appwrite.ID.unique(), {
            name,
            price,
            shortDescription,
            description,
            category,
            tags,
            image1: imageUrls[0] || '',
            image2: imageUrls[1] || '',
            image3: imageUrls[2] || '',
            image4: imageUrls[3] || '',
            image5: imageUrls[4] || ''
        });
        alert('Product added successfully!');
        document.getElementById('addProductForm').reset();
        fetchProducts();
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product');
    }
});

// Function to fetch products
async function fetchProducts() {
    try {
        const response = await database.listDocuments(databaseId, collectionId);
        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '';
        
        response.documents.forEach(product => {
            const productItem = document.createElement('div');
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.shortDescription}</p>
                <p>Price: $${product.price}</p>
                <img src="${product.image1}" width="100" />
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
            `;
            productsList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to delete a product
async function deleteProduct(productId) {
    try {
        await database.deleteDocument(databaseId, collectionId, productId);
        alert('Product deleted');
        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Fetch products on page load
document.addEventListener('DOMContentLoaded', fetchProducts);
