document.addEventListener('DOMContentLoaded', async () => {
  // ---------- SPA NAVIGATION ----------
  const hero = document.querySelector('.hero');
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');

  function showPage(id) {
    pages.forEach(p => p.classList.add('hidden-section'));
    if (id !== '#home') hero.classList.add('hidden-section');
    else hero.classList.remove('hidden-section');

    const target = document.querySelector(id);
    if (target) target.classList.remove('hidden-section');

    navLinks.forEach(l => l.classList.remove('active'));
    const link = document.querySelector(`a[href="${id}"]`);
    if (link) link.classList.add('active');

    history.pushState(null, '', id);
  }

  navLinks.forEach(l => {
    l.addEventListener('click', e => {
      e.preventDefault();
      showPage(l.getAttribute('href'));
      document.querySelector('nav').classList.remove('open');
    });
  });

  document.getElementById('menuToggle').onclick = () => {
    document.querySelector('nav').classList.toggle('open');
  };

  document.getElementById('bookServiceBtn').onclick = () => showPage('#products');

  // ---------- HERO SLIDESHOW ----------
  const slides = document.querySelectorAll('.slide');
  let s = 0;
  setInterval(() => {
    if (!hero.classList.contains('hidden-section')) {
      slides.forEach(sl => sl.classList.remove('active'));
      s = (s + 1) % slides.length;
      slides[s].classList.add('active');
    }
  }, 5000);

  // ---------- PRODUCTS ----------
  let products = [];
  async function fetchProducts() {
    try {
      const res = await fetch('products.json');
      products = await res.json();
      renderProducts();
      renderAdmin(); // ensure admin list updates
    } catch (err) {
      console.error('Failed to fetch products.json', err);
    }
  }
  fetchProducts();

  const productList = document.getElementById('product-list');
  function renderProducts() {
    if (!productList) return;
    productList.innerHTML = '';
    products.forEach(p => {
      productList.innerHTML += `
        <div class="product" style="opacity:${p.stock ? 1 : 0.4}">
          <img src="${p.image}" alt="${p.name}" style="width:100%; height:150px; object-fit:contain; margin-bottom:5px;">
          <h3>${p.name}</h3>
          <p>KES ${p.price}</p>
          <small>${p.stock ? "In Stock" : "Out of Stock"}</small><br>
          <button class="cta-btn" ${!p.stock ? "disabled" : ""} onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
          <button class="ask-expert-btn" onclick="askExpert('${p.tags}')">Ask Expert</button>
        </div>`;
    });
  }

  // ---------- CART ----------
  let cart = [];
  window.addToCart = function(name, price) {
    cart.push({ name, price });
    updateCart();
    showPage('#cart');
  };

  function updateCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    let total = 0;
    cartItems.innerHTML = '';
    cart.forEach(i => { cartItems.innerHTML += `${i.name} - KES ${i.price}<br>`; total += i.price; });
    document.getElementById('cart-count').textContent = cart.length;
    document.getElementById('cart-total').textContent = `Total: KES ${total}`;
  }

  document.getElementById('checkoutPaybill').onclick = () => {
    if (cart.length === 0) return alert('Cart empty');
    document.getElementById('paybill-info').classList.remove('hidden-section');
  };

  document.getElementById('confirmPaymentBtn').onclick = () => {
    if (cart.length === 0) return alert('Cart empty');
    let msg = "Payment Confirmation:%0A";
    let total = 0;
    cart.forEach(i => { msg += `${i.name} - KES ${i.price}%0A`; total += i.price; });
    msg += `Total Paid: KES ${total}`;
    window.open(`https://wa.me/254780328599?text=${msg}`);
  };

  document.getElementById('waOrder').onclick = () => {
    if (cart.length === 0) return alert('Cart empty');
    let msg = "HYBRID CENTRE ORDER%0A-----------------%0A";
    let total = 0;
    cart.forEach(i => { msg += `${i.name} - KES ${i.price}%0A`; total += i.price; });
    msg += `-----------------%0ATOTAL: KES ${total}%0AVehicle: ___________%0ALocation: ___________%0A`;
    window.open(`https://wa.me/254780328599?text=${msg}`);
  };
// ---------- ADMIN MODAL ----------
const adminModal = document.getElementById('adminModal');
const adminBtn = document.getElementById('adminLoginBtn');
const closeAdmin = document.getElementById('closeAdmin');

// Open modal on button click
adminBtn.onclick = () => adminModal.classList.remove('hidden-section');

// Close modal on close button
closeAdmin.onclick = () => adminModal.classList.add('hidden-section');

// Optional: close modal by clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === adminModal) {
    adminModal.classList.add('hidden-section');
  }
});

// Admin product list render
const pname = document.getElementById('pname');
const pprice = document.getElementById('pprice');
const ptags = document.getElementById('ptags');
const pimage = document.getElementById('pimage');
const addProductBtn = document.getElementById('addProductBtn');
const adminList = document.getElementById('admin-list');

window.renderAdmin = function(products) {
  if (!adminList) return;
  adminList.innerHTML = '';
  products.forEach(p => {
    adminList.innerHTML += `<li>${p.name} - KES ${p.price} - ${p.stock ? "In Stock" : "Out of Stock"}</li>`;
  });
};

// Add product
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
  renderProducts();
  renderAdmin(products);
  pname.value = pprice.value = ptags.value = pimage.value = '';
};


  // ---------- LOAD PAGE FROM HASH ----------
  if (window.location.hash) showPage(window.location.hash);
});
