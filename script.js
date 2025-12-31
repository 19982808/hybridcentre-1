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
let products = JSON.parse(localStorage.getItem("products"))||[
  {id:1,name:"Hybrid Battery Modules",price:500,description:"High quality battery module",image:"images/products/battery_module-8.png",stock:true},
  {id:2,name:"Inverter & Power Control Unit",price:400,description:"Efficient inverter",image:"images/products/inverter.png",stock:true},
  {id:3,name:"Cooling Fans & Pumps",price:200,description:"Cooling solution",image:"images/products/cooling.png",stock:true}
];
function saveProducts(){localStorage.setItem("products",JSON.stringify(products));}
function renderProducts(){
  const list=document.getElementById("product-list");
  list.innerHTML="";
  products.forEach(p=>{
    list.innerHTML+=`<div class="product" style="opacity:${p.stock?1:.4}">
      <img src="${p.image}" alt="${p.name}" style="width:100px; height:100px; object-fit:contain;">
      <h3>${p.name}</h3>
      <p>KES ${p.price}</p>
      <small>${p.stock?"In Stock":"Out of Stock"}</small>
      <button class="cta-btn" ${!p.stock?"disabled":""} onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
      <button class="ask-expert-btn" onclick="alert('Ask expert about ${p.name}')">Ask Expert</button>
    </div>`;
  });
}
renderProducts();

// ---------- ADMIN DASHBOARD ----------
const modal = document.getElementById("adminModal");
const adminBtn = document.getElementById("adminLoginBtn");
const closeAdmin = document.getElementById("closeAdmin");
if(adminBtn && modal) adminBtn.onclick=()=>modal.classList.remove("hidden");
if(closeAdmin && modal) closeAdmin.onclick=()=>modal.classList.add("hidden");

function renderAdmin(){
  const list = document.getElementById("admin-list"); list.innerHTML="";
  products.forEach(p=>{
    list.innerHTML+=`<li>${p.name} - ${p.stock?"IN":"OUT"} 
    <button onclick="toggleStock(${p.id})">Toggle</button></li>`;
  });
}
function addProduct(){
  const name=document.getElementById("pname").value;
  const price=+document.getElementById("pprice").value;
  const tags=document.getElementById("ptags").value;
  const image=document.getElementById("pimage").value;
  if(!name||!price) return alert("Name & Price required");
  products.push({id:Date.now(),name,price,tags,stock:true,image});
  saveProducts(); renderProducts(); renderAdmin();
  document.getElementById("pname").value="";
  document.getElementById("pprice").value="";
  document.getElementById("ptags").value="";
  document.getElementById("pimage").value="";
}
function toggleStock(id){ const p=products.find(x=>x.id===id); p.stock=!p.stock; saveProducts(); renderProducts(); renderAdmin(); }
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
