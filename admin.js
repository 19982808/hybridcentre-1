document.addEventListener('DOMContentLoaded', () => {

  const ADMIN_PASSWORD = "1234"; // 🔒 change this

  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminModal = document.getElementById('adminModal');
  const closeAdmin = document.getElementById('closeAdmin');

  const adminAccessBtn = document.getElementById('adminAccessBtn');
  const adminPassword = document.getElementById('adminPassword');
  const adminError = document.getElementById('adminError');

  const adminList = document.getElementById('admin-list');
  const addProductBtn = document.getElementById('addProductBtn');

  // ================= OPEN LOGIN =================
  adminLoginBtn.onclick = () => {
    adminLoginModal.classList.remove('hidden');
  };

  // ================= LOGIN =================
  adminAccessBtn.onclick = () => {
    if (adminPassword.value === ADMIN_PASSWORD) {
      adminLoginModal.classList.add('hidden');
      adminModal.classList.remove('hidden');
      adminPassword.value = '';
      adminError.style.display = 'none';
      renderAdmin();
    } else {
      adminError.style.display = 'block';
    }
  };

  // ================= CLOSE ADMIN =================
  closeAdmin.onclick = () => {
    adminModal.classList.add('hidden');
  };

  // ================= LOAD PRODUCTS =================
  function getProducts() {
    const stored = localStorage.getItem('adminProducts');
    if (stored) return JSON.parse(stored);

    // fallback to products.json if no local edits
    return window.products || [];
  }

  // ================= SAVE PRODUCTS =================
  function saveProducts(data) {
    localStorage.setItem('adminProducts', JSON.stringify(data));
  }

  // ================= RENDER ADMIN =================
  function renderAdmin() {
    if (!adminList) return;

    const products = getProducts();
    adminList.innerHTML = '';

    products.forEach((p, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.name}</strong> – KES ${p.price}
        <button data-index="${index}" class="delete-btn">❌</button>
      `;
      adminList.appendChild(li);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = () => {
        const products = getProducts();
        products.splice(btn.dataset.index, 1);
        saveProducts(products);
        renderAdmin();
        renderProductsFromAdmin();
      };
    });
  }

  // ================= ADD PRODUCT =================
  addProductBtn.onclick = () => {
    const name = document.getElementById('pname').value.trim();
    const price = Number(document.getElementById('pprice').value);
    const tags = document.getElementById('ptags').value.trim();
    const image = document.getElementById('pimage').value.trim();

    if (!name || !price || !image) {
      alert('Fill name, price and image');
      return;
    }

    const products = getProducts();

    products.push({
      id: Date.now(),
      name,
      price,
      tags,
      stock: true,
      image
    });

    saveProducts(products);
    renderAdmin();
    renderProductsFromAdmin();

    document.getElementById('pname').value = '';
    document.getElementById('pprice').value = '';
    document.getElementById('ptags').value = '';
    document.getElementById('pimage').value = '';
  };

  // ================= SYNC TO SHOP =================
  function renderProductsFromAdmin() {
    if (typeof window.renderProducts === 'function') {
      window.renderProducts(getProducts());
    }
  }

});
