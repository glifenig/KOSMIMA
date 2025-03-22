async function fetchUsers() {
    try {
        // ✅ Use correct variable names
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

// ✅ Load users on page load
document.addEventListener("DOMContentLoaded", fetchUsers);
