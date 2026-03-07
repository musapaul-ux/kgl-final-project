
document.getElementById("logoutBtn").addEventListener("click", logoutUser);

      // Load procurements table
    async function loadProcurements() {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          });

         
          const products = await res.json();
          console.log("Fetched products data", products);
          const tbody = document.getElementById("productTableBody");

          if (products.length === 0) {
            tbody.innerHTML =
              "<tr><td colspan='8' style='text-align:center;'>No products available.</td></tr>";
            return;
          }

          tbody.innerHTML = products  
            .map(
              (p) => `
              <tr>
                <td>${new Date(p.createdAt).toLocaleDateString()}</td>
                <td>${p.name}</td>
                <td>${p.quantity}</td>
                <td>${p.price.toLocaleString()}</td>
                <td>
                  <button class='deleteBtn' data-id="${p._id}" style="padding:5px 10px; background:#d63384; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
                </td>
              </tr>
            `,
            )
            .join("");
        } catch (err) {
          document.getElementById("productMessage").innerHTML =
            `<p style="color:red;">Error loading products: ${err.message}</p>`;
          document.getElementById("productTableBody").innerHTML =
            `<tr><td colspan="8" style="text-align:center; color:red;">${err.message}</td></tr>`;
        }
    }

      // Delete product
    async function deleteProduct(id) {
        if (!confirm("Are you sure you want to delete this product?"))
          return;
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || "Failed to delete");
          document.getElementById("productMessage").textContent =
            "Product deleted successfully!";
          document.getElementById("productMessage").style.color = "green";
          setTimeout(() => loadProcurements(), 1000);
        } catch (err) {
          document.getElementById("productMessage").textContent =
            err.message;
          document.getElementById("productMessage").style.color = "red";
        }
    }

      // Load on page load
    document.addEventListener("DOMContentLoaded", () => {
    loadProcurements();

    const tableBody = document.getElementById("productTableBody");

    tableBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("deleteBtn")) {
            const productId = e.target.getAttribute("data-id");
            console.log("Deleting product with ID:", productId);
            deleteProduct(productId);
        }
    });
});