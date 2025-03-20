// Initialize Appwrite SDK
const { Client, Databases, Storage } = Appwrite;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("67dadf1b001c8beaaa91"); // Your Appwrite project ID
  .setKey("standard_0d7e45c6aacf8b3240c81e32e8d786a65dd2a8adeaefabc7005c7deb704d3b944fca79cb5419c4eae7d76de140fe3d198fa24667814e90fbf9d782ff361cf09fd64d342f5900cb788a00113c06f758345353efad840e9a3bfd5b3bca1590abcc02715f90ba2307e3251cbd24b59c2538d4d81ab66416fd6313500c0fa4d98b73"); // Replace with your API key


const databases = new Databases(client);
const storage = new Storage(client);

document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let imageFile = document.getElementById("image").files[0];
    let description = document.getElementById("description").value;

    try {
        // Upload image to Appwrite Storage
        const fileUpload = await storage.createFile("67dc258000056ec47ca5", "unique()", imageFile);
        const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/67dc258000056ec47ca5/files/${fileUpload.$id}/view?project=67dadf1b001c8beaaa91`;

        // Insert product details into Appwrite Database
        await databases.createDocument("67dc232d000c5295ee23", "Products", "unique()", {
            name,
            price,
            image: imageUrl,
            description
        });

        alert("Product added successfully!");
        document.getElementById("addProductForm").reset();
    } catch (error) {
        console.error(error);
        alert("Error adding product");
    }
});
