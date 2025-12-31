document.addEventListener('DOMContentLoaded', () => {

  /* ================= SPA NAVIGATION ================= */
  const hero = document.querySelector('.hero');
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');

  function showPage(id) {
    pages.forEach(p => p.classList.add('hidden-section'));

    if (id === '#home' || !id) {
      hero?.classList.remove('hidden-section');
    } else {
      hero?.classList.add('hidden-section');
    }

    const target = document.querySelector(id);
    if (target) target.classList.remove('hidden-section');

    navLinks.forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`a[href="${id}"]`);
    if (activeLink) activeLink.classList.add('active');

    history.pushState(null, '', id);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.getAttribute('href'));
      document.querySelector('nav')?.classList.remove('open');
    });
  });

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.querySelector('nav')?.classList.toggle('open');
  });

  document.getElementById('bookServiceBtn')?.addEventListener('click', () => {
    showPage('#products');
  });

  /* ================= HERO SLIDESHOW ================= */
  const slides = document.querySelectorAll('.slide');
  let slideIndex = 0;

  setInterval(() => {
    if (!hero?.classList.contains('hidden-section') && slides.length > 0) {
      slides.forEach(s => s.classList.remove('active'));
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
    }
  }, 5000);

  /* ================= PRODUCTS ================= */
  const productList = document.getElementById('product-list');
  let products = [];

  async function fetchProducts() {
    try {
      const res = await fetch('./products.json');
      products = await res.json();
      renderProducts();
    } catch (err) {
      console.error('Failed to load products.json', err);
      if (productList) {
        productList.innerHTML = `<p style="color:red">Failed to load products.</p>`;
      }
    }
  }

  function renderProducts() {
    if (!productList) return;

    productList.innerHTML = '';

    products.forEach(p => {
      productList.innerHTML += `
        <div class="product" style="opacity:${p.stock ? 1 : 0.4}">
          <img 
            src="${p.image}" 
            alt="${p.name}" 
            onerror="this.src='images/products/placeholder.png'"
            style="width:100%; height:150px; object-fit:contain; margin-bottom:6px;"
          >
          <h3>${p.name}</h3>
          <p>KES ${p.price}</p>
          <small>${p.stock ? 'In Stock' : 'Out of Stock'}</small><br>

          <button 
            class="cta-btn" 
            ${!p.stock ? 'disabled' : ''}
            onclick="addToCart('${p.name}', ${p.price})"
          >
            Add to Cart
          </button>

          <button 
            class="ask-expert-btn"
            onclick="askExpert('${p.name}')"
          >
            Ask Expert
          </button>
        </div>
      `;
    });
  }

  fetchProducts();

  /* ================= CART ================= */
  let cart = [];

  window.addToCart = function (name, price) {
    cart.push({ name, price });
    updateCart();
    showPage('#cart');
  };

  function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems) return;

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
      cartItems.innerHTML += `${item.name} - KES ${item.price}<br>`;
      total += item.price;
    });

    if (cartCount) cartCount.textContent = cart.length;
    if (cartTotal) cartTotal.textContent = `Total: KES ${total}`;
  }

  document.getElementById('checkoutPaybill')?.addEventListener('click', () => {
    if (cart.length === 0) return alert('Cart is empty');
    document.getElementById('paybill-info')?.classList.remove('hidden-section');
  });

  document.getElementById('confirmPaymentBtn')?.addEventListener('click', () => {
    if (cart.length === 0) return alert('Cart is empty');

    let msg = "Payment Confirmation:%0A";
    let total = 0;

    cart.forEach(i => {
      msg += `${i.name} - KES ${i.price}%0A`;
      total += i.price;
    });

    msg += `Total Paid: KES ${total}`;
    window.open(`https://wa.me/254780328599?text=${msg}`);
  });

  document.getElementById('waOrder')?.addEventListener('click', () => {
    if (cart.length === 0) return alert('Cart is empty');

    let msg = "HYBRID CENTRE ORDER%0A-----------------%0A";
    let total = 0;

    cart.forEach(i => {
      msg += `${i.name} - KES ${i.price}%0A`;
      total += i.price;
    });

    msg += `-----------------%0ATOTAL: KES ${total}%0AVehicle: _______%0ALocation: _______`;

    window.open(`https://wa.me/254780328599?text=${msg}`);
  });

  /* ================= ASK EXPERT ================= */
  window.askExpert = function (productName) {
    const msg = `Hello Hybrid Centre, I need expert advice on: ${productName}`;
    window.open(`https://wa.me/254780328599?text=${encodeURIComponent(msg)}`);
  };

});
