document.addEventListener('DOMContentLoaded', () => {
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminModal = document.getElementById('adminModal');
  const adminBtn = document.getElementById('adminLoginBtn');
  const adminAccessBtn = document.getElementById('adminAccessBtn');
  const closeAdminLogin = adminLoginModal.querySelector('.close');
  const closeAdmin = document.getElementById('closeAdmin');
  const adminError = document.getElementById('adminError');

  const pname = document.getElementById('pname');
  const pprice = document.getElementById('pprice');
  const ptags = document.getElementById('ptags');
  const pimage = document.getElementById('pimage');
  const addProductBtn = document.getElementById('addProductBtn');
  const adminList = document.getElementById('admin-list');

  let products = JSON.parse(localStorage.getItem('products')) || [];

  // ---------- SHOW LOGIN MODAL ----------
  adminBtn.onclick = () => {
    adminLoginModal.classList.remove('hidden-section');
    adminError.style.display = 'none';
  };

  closeAdminLogin?.addEventListener('click', () => {
    adminLoginModal.classList.add('hidden-section');
  });

  // ---------- LOGIN VALIDATION ----------
  adminAccessBtn.onclick = () => {
    const passwordInput = document.getElementById('adminPassword').value;
    if (passwordInput === '12345') { // <-- Set your password here
      adminLoginModal.classList.add('hidden-section');
      adminModal.classList.remove('hidden-section');
      renderAdmin();
    } else {
      adminError.style.display = 'block';
    }
  };

  // ---------- CLOSE ADMIN DASHBOARD ----------
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
    console.log(`Admin Log: Inventory updated at ${new Date().toLocaleString()}`);
  }

  // INITIAL RENDER
  renderAdmin();
  if (!window.renderProducts) window.renderProducts = () => {};
});
