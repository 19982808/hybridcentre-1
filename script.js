// ---------- SPA NAVIGATION ----------
const hero = document.querySelector(".hero");
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");
function showPage(id){
  pages.forEach(p=>p.classList.add("hidden-section"));
  if(id!="#home"){ hero.classList.add("hidden-section"); document.querySelector(id)?.classList.remove("hidden-section"); }
  else hero.classList.remove("hidden-section");
  navLinks.forEach(l=>l.classList.remove("active"));
  document.querySelector(`a[href="${id}"]`)?.classList.add("active");
  history.pushState(null,"",id);
}
navLinks.forEach(l=>l.addEventListener("click", e=>{ e.preventDefault(); showPage(l.getAttribute("href")); document.querySelector("nav").classList.remove("open"); }));
document.getElementById("menuToggle").onclick=()=>document.querySelector("nav").classList.toggle("open");
document.getElementById("bookServiceBtn").onclick=()=>showPage("#products");

// ---------- PRODUCTS ----------
let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Hybrid Battery Modules", price: 500, description: "High quality battery module", image: "images/products/battery_module-8.png", stock: true },
  { id: 2, name: "Inverter & Power Control Unit", price: 400, description: "Efficient inverter", image: "images/products/inverter.png", stock: true },
  { id: 3, name: "Cooling Fans & Pumps", price: 200, description: "Cooling solution", image: "images/products/cooling.png", stock: true }
];
function saveProducts() { localStorage.setItem("products", JSON.stringify(products)); }

// ---------- RENDER PRODUCTS ----------
function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach(p => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.style.opacity = p.stock ? 1 : 0.4;
    productDiv.innerHTML = `
      <img src="${p.image}" alt="${p.name}" style="width:100px; height:100px; object-fit:contain;">
      <h3>${p.name}</h3>
      <p>KES ${p.price}</p>
      <small>${p.stock ? "In Stock" : "Out of Stock"}</small>
      <button class="cta-btn" ${!p.stock ? "disabled" : ""} data-id="${p.id}">Add to Cart</button>
      <button class="ask-expert-btn">Ask Expert</button>
    `;
    // Add to cart click
    productDiv.querySelector(".cta-btn").addEventListener("click", () => addToCart(p.name, p.price));
    list.appendChild(productDiv);
  });
}
renderProducts();

// ---------- ADMIN DASHBOARD ----------
const modal = document.getElementById("adminModal");
const adminBtn = document.getElementById("adminLoginBtn");
const closeAdmin = document.getElementById("closeAdmin");
const addProductBtn = document.getElementById("addProductBtn");
const adminList = document.getElementById("admin-list");

if (adminBtn && modal) adminBtn.onclick = () => {
  modal.classList.remove("hidden");
  renderAdmin();
};
if (closeAdmin && modal) closeAdmin.onclick = () => modal.classList.add("hidden");

function renderAdmin() {
  adminList.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `${p.name} - ${p.stock ? "IN" : "OUT"} 
      <button class="toggle-stock" data-id="${p.id}">Toggle</button>
      <button class="delete-product" data-id="${p.id}">Delete</button>`;
    adminList.appendChild(li);
  });

  // Attach toggle event listeners dynamically
  document.querySelectorAll(".toggle-stock").forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id);
      toggleStock(id);
    };
  });

  // Attach delete event listeners dynamically
  document.querySelectorAll(".delete-product").forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id);
      deleteProduct(id);
    };
  });
}

function addProduct() {
  const name = document.getElementById("pname").value.trim();
  const price = parseFloat(document.getElementById("pprice").value);
  const tags = document.getElementById("ptags").value.trim();
  const image = document.getElementById("pimage").value.trim();

  if (!name || !price || !image) return alert("Name, Price, and Image are required!");

  const newProduct = {
    id: Date.now(),
    name,
    price,
    tags,
    stock: true,
    image
  };
  products.push(newProduct);
  saveProducts();
  renderProducts();
  renderAdmin();

  // Reset form
  document.getElementById("pname").value = "";
  document.getElementById("pprice").value = "";
  document.getElementById("ptags").value = "";
  document.getElementById("pimage").value = "";
}
addProductBtn.onclick = addProduct;

function toggleStock(id) {
  const p = products.find(x => x.id === id);
  if (p) p.stock = !p.stock;
  saveProducts();
  renderProducts();
  renderAdmin();
}

function deleteProduct(id) {
  products = products.filter(x => x.id !== id);
  saveProducts();
  renderProducts();
  renderAdmin();
}

// Initial render
renderAdmin();


// ---------- CART ----------
let cart=[];
function addToCart(name,price){ cart.push({name,price}); updateCart(); showPage("#cart"); }
function updateCart(){ const cartItems=document.getElementById("cart-items"); let total=0; cartItems.innerHTML=""; cart.forEach(item=>{ cartItems.innerHTML+=`${item.name} - KES ${item.price}<br>`; total+=item.price; }); document.getElementById("cart-count").textContent=cart.length; document.getElementById("cart-total").textContent=`Total: KES ${total}`; }
document.getElementById("checkoutPaybill").onclick=()=>{if(cart.length===0)return alert("Cart empty"); document.getElementById("paybill-info").classList.remove("hidden-section"); };
document.getElementById("confirmPaymentBtn").onclick=()=>{
  if(cart.length===0)return alert("Cart empty");
  let msg="Payment Confirmation for Order:%0A"; let total=0;
  cart.forEach(i=>{ msg+=`${i.name} - KES ${i.price}%0A`; total+=i.price; });
  msg+=`Total Paid: KES ${total}`;
  window.open(`https://wa.me/254780328599?text=${msg}`);
};
document.getElementById("waOrder").onclick=()=>{ if(cart.length===0)return alert("Cart empty"); let msg="HYBRID CENTRE ORDER%0A-----------------%0A"; let total=0; cart.forEach(i=>{ msg+=`${i.name} - KES ${i.price}%0A`; total+=i.price; }); msg+=`-----------------%0ATOTAL: KES ${total}%0AVehicle: ___________%0ALocation: ___________%0A`; window.open(`https://wa.me/254780328599?text=${msg}`); };
document.getElementById("stkBtn").onclick=()=>alert("STK Push coming soon!");
