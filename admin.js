// admin.js
document.addEventListener('DOMContentLoaded', () => {
  const adminBtn = document.getElementById("adminLoginBtn");
  const modal = document.getElementById("adminModal");
  const closeAdmin = document.getElementById("closeAdmin");
  const adminList = document.getElementById("admin-list");
  const addBtn = document.getElementById("addProductBtn");

  let products = [];

  // Open/close modal
  if(adminBtn && modal) adminBtn.onclick = () => modal.classList.remove("hidden");
  if(closeAdmin && modal) closeAdmin.onclick = () => modal.classList.add("hidden");

  // Fetch products JSON
  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      products = data;
      renderAdmin();
    })
    .catch(err => console.error("Could not load products.json:", err));

  // Render admin inventory list
  function renderAdmin() {
    adminList.innerHTML = "";
    products.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${p.name} - ${p.stock ? "IN" : "OUT"}
        <button onclick="toggleStock(${p.id})">Toggle</button>
      `;
      adminList.appendChild(li);
    });
  }

  // Toggle stock globally for inline onclick
  window.toggleStock = function(id) {
    const p = products.find(x => x.id === id);
    if(p) p.stock = !p.stock;
    renderAdmin();
  }

  // Add new product
  addBtn.onclick = () => {
    const name = document.getElementById("pname").value.trim();
    const price = +document.getElementById("pprice").value;
    const tags = document.getElementById("ptags").value.trim();
    if(!name || !price) return alert("Name & Price required");
    products.push({
      id: Date.now(),
      name,
      price,
      tags,
      stock: true,
      image: ""
    });
    renderAdmin();
    document.getElementById("pname").value = "";
    document.getElementById("pprice").value = "";
    document.getElementById("ptags").value = "";
  }
});



