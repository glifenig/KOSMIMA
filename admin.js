// Initialize Appwrite
const client = new Appwrite.Client();
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67dd7787000277407b0a');

// Function to upload images and return their URLs
async function uploadImages(files) {
  const imageUrls = [];
  for (let file of files) {
    const uploadedFile = await storage.createFile('product-images', ID.unique(), file);
    const fileUrl = storage.getFileView('product-images', uploadedFile.$id);
    imageUrls.push(fileUrl);
  }
  return imageUrls;
}

// Function to add a new product
async function addProduct(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = parseInt(document.getElementById('price').value, 10);
  const imageFiles = document.getElementById('images').files;

  if (!title || !description || !price || imageFiles.length === 0) {
    alert('Please fill all fields and upload at least one image.');
    return;
  }

  try {
    const imageUrls = await uploadImages(imageFiles);
    await databases.createDocument(
      '67dd77fe000d21d01da5', // Database ID
      '67dd782400354e955129', // Collection ID
      ID.unique(),
      {
        title,
        description,
        price,
        images: imageUrls // Store images as an array
      }
    );
    alert('Product added successfully!');
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

document.getElementById('addProductForm').addEventListener('submit', addProduct);
