// admin.js — INVENTORY MANAGER ONLY
document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("adminLoginBtn");
  const adminModal = document.getElementById("adminModal");
  const closeAdmin = document.getElementById("closeAdmin");
  const adminList = document.getElementById("admin-list");

  let products = [];

  // ===== Open / Close Admin =====
  adminBtn?.addEventListener("click", () => {
    adminModal.classList.remove("hidden");
  });

  closeAdmin?.addEventListener("click", () => {
    adminModal.classList.add("hidden");
  });

  // ===== Load products.json =====
  fetch("./products.json")
    .then(res => {
      if (!res.ok) throw new Error("products.json not found");
      return res.json();
    })
    .then(data => {
      products = data;
      renderAdmin();
    })
    .catch(err => {
      adminList.innerHTML = "<li>Failed to load inventory</li>";
      console.error(err);
    });

  // ===== Render Inventory =====
  function renderAdmin() {
    adminList.innerHTML = "";

    products.forEach(p => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${p.name}</strong><br>
        <small>${p.tags}</small><br>
        <span>Status: ${p.stock ? "IN STOCK" : "OUT OF STOCK"}</span><br>
        <button data-id="${p.id}">Toggle Stock</button>
        <hr>
      `;

      adminList.appendChild(li);
    });

    adminList.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => toggleStock(btn.dataset.id);
    });
  }

  function toggleStock(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    product.stock = !product.stock;
    renderAdmin();
  }
});
