document.addEventListener('DOMContentLoaded', () => {
  const adminModal = document.getElementById('adminModal');
  const adminBtn = document.getElementById('adminLoginBtn');
  const closeAdmin = document.getElementById('closeAdmin');

  const pname = document.getElementById('pname');
  const pprice = document.getElementById('pprice');
  const ptags = document.getElementById('ptags');
  const pimage = document.getElementById('pimage');
  const addProductBtn = document.getElementById('addProductBtn');
  const adminList = document.getElementById('admin-list');

  let products = JSON.parse(localStorage.getItem('products')) || [];

  // ---------- SHOW / HIDE ADMIN MODAL ----------
  adminBtn.onclick = () => adminModal.classList.remove('hidden-section');
  closeAdmin.onclick = () => adminModal.classList.add('hidden-section');

  // ---------- RENDER ADMIN LIST ----------
  function renderAdmin() {
    adminList.innerHTML = '';
    products.forEach((p, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${p.image}" alt="${p.name}" style="width:50px; height:50px; object-fit:contain; margin-right:10px;">
        <strong>${p.name}</strong> - KES ${p.price} - ${p.stock ? 'In Stock' : 'Out of Stock'}
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;
      adminList.appendChild(li);

      // Edit functionality
      li.querySelector('.edit-btn').onclick = () => {
        const newPrice = prompt('Enter new price:', p.price);
        const newStock = confirm('Is this product in stock? OK = Yes, Cancel = No');
        if (newPrice !== null) p.price = parseFloat(newPrice);
        p.stock = newStock;
        saveProducts();
        renderAdmin();
        renderProducts();
      };

      // Delete functionality
      li.querySelector('.delete-btn').onclick = () => {
        if (confirm(`Delete ${p.name}?`)) {
          products.splice(index, 1);
          saveProducts();
          renderAdmin();
          renderProducts();
        }
      };
    });
  }

  // ---------- ADD PRODUCT ----------
  addProductBtn.onclick = () => {
    if (!pname.value || !pprice.value || !pimage.value) return alert('Please fill in name, price, and image');
    const newProduct = {
      id: products.length + 1,
      name: pname.value,
      price: parseFloat(pprice.value),
      tags: ptags.value || "",
      stock: true,
      image: pimage.value
    };
    products.push(newProduct);
    saveProducts();
    renderAdmin();
    renderProducts();
    pname.value = pprice.value = ptags.value = pimage.value = '';
  };

  // ---------- SAVE / LOAD FROM LOCALSTORAGE ----------
  function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    logAdminActivity('Updated inventory');
  }

  // ---------- ADMIN ACTIVITY LOG ----------
  function logAdminActivity(msg) {
    console.log(`Admin Log: ${msg} at ${new Date().toLocaleString()}`);
  }

  // INITIAL RENDER
  renderAdmin();
  if (!window.renderProducts) window.renderProducts = () => {};
});
