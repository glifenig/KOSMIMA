// Initialize Appwrite SDK
const { Client, Storage, Databases } = Appwrite;

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Endpoint
    .setProject("67dd7787000277407b0a"); // Project ID

const databases = new Databases(client); // ✅ Move this above fetchUsers
const storage = new Storage(client);

const databaseID = "67dd77fe000d21d01da5"; // Database ID
const collectionID = "67de8e8f0022e5645291"; // User Collection ID (for user details)
const productCollectionID = "67dd782400354e955129"; // Product Collection ID
const bucketID = "product-images"; // Storage bucket

// ✅ Fetch Users for Admin
async function fetchUsers() {
    try {
        const response = await databases.listDocuments(databaseID, collectionID);
        const userList = document.getElementById("user-list");

        userList.innerHTML = "";
        response.documents.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.innerHTML = `<p><strong>${user.name}</strong> - ${user.phone} - ${user.email}</p>`;
            userList.appendChild(userDiv);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// ✅ Load Users on Page Load
document.addEventListener("DOMContentLoaded", fetchUsers);
