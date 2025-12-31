// SPA NAVIGATION
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

// HERO SLIDESHOW
const slides=document.querySelectorAll(".slide");let s=0;
setInterval(()=>{if(!hero.classList.contains("hidden-section")){slides.forEach(sl=>sl.classList.remove("active")); s=(s+1)%slides.length; slides[s].classList.add("active");}},5000);

// PRODUCTS
let products = [];
fetch('products.json')
.then(res=>res.json())
.then(data=>{
  products = data;
  renderProducts();
  renderAdmin();
})
.catch(err=>console.error("Failed to fetch products.json", err));

function renderProducts(){
  const list=document.getElementById("product-list");
  if(!list) return;
  list.innerHTML="";
  products.forEach(p=>{
    list.innerHTML+=`<div class="product" style="opacity:${p.stock?1:.4}">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>KES ${p.price}</p>
      <small>${p.stock?"In Stock":"Out of Stock"}</small>
      <button class="cta-btn" ${!p.stock?"disabled":""} onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
    </div>`;
  });
}

// ADMIN
const modal = document.getElementById("adminModal");
document.getElementById("adminLoginBtn").onclick=()=>modal.classList.remove("hidden");
document.getElementById("closeAdmin").onclick=()=>modal.classList.add("hidden");

function renderAdmin(){
  const list = document.getElementById("admin-list"); if(!list) return;
  list.innerHTML="";
  products.forEach(p=>{
    list.innerHTML+=`<li>${p.name} - ${p.stock?"IN":"OUT"} 
    <button onclick="toggleStock(${p.id})">Toggle</button></li>`;
  });
}
document.getElementById("addProductBtn").onclick=()=>{
  const name=document.getElementById("pname").value;
  const price=+document.getElementById("pprice").value;
  const tags=document.getElementById("ptags").value;
  const image=document.getElementById("pimage").value;
  if(!name||!price||!image) return alert("Name, Price & Image required");
  products.push({id:Date.now(),name,price,tags,image,stock:true});
  renderProducts(); renderAdmin();
  document.getElementById("pname").value="";
  document.getElementById("pprice").value="";
  document.getElementById("ptags").value="";
  document.getElementById("pimage").value="";
}
function toggleStock(id){ const p=products.find(x=>x.id===id); p.stock=!p.stock; renderProducts(); renderAdmin(); }

// CART
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
