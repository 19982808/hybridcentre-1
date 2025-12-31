document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  let products = [];

  // Fetch products from JSON
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      renderProducts();
      renderAdmin();
    })
    .catch(err => console.error("Failed to load products:", err));

  // ---------- RENDER PRODUCTS ----------
  function renderProducts() {
    productList.innerHTML = "";
    products.forEach(p => {
      productList.innerHTML += `
        <div class="product" style="opacity:${p.stock?1:.4}">
          <img src="${p.image || 'images/default.png'}" alt="${p.name}" style="width:100%; height:150px; object-fit:contain; margin-bottom:10px;">
          <h3>${p.name}</h3>
          <p>KES ${p.price}</p>
          <small>${p.stock?"In Stock":"Out of Stock"}</small><br>
          <button class="cta-btn" ${!p.stock?"disabled":""} onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
        </div>
      `;
    });
  }

  // ---------- ADMIN PANEL ----------
  const modal = document.getElementById("adminModal");
  document.getElementById("adminLoginBtn").onclick = () => modal.classList.remove("hidden");
  document.getElementById("closeAdmin").onclick = () => modal.classList.add("hidden");

  function renderAdmin() {
    const list = document.getElementById("admin-list");
    list.innerHTML = "";
    products.forEach(p => {
      list.innerHTML += `<li>${p.name} - ${p.stock?"IN":"OUT"} 
        <button onclick="toggleStock(${p.id})">Toggle</button></li>`;
    });
  }

  document.getElementById("addProductBtn").onclick = () => {
    const name = document.getElementById("pname").value;
    const price = +document.getElementById("pprice").value;
    const tags = document.getElementById("ptags").value;
    const image = prompt("Enter relative path for product image (e.g., images/new.png):");
    if(!name||!price) return alert("Name & Price required");
    const newProduct = {id:Date.now(), name, price, tags, stock:true, image};
    products.push(newProduct);
    renderProducts();
    renderAdmin();
    document.getElementById("pname").value="";
    document.getElementById("pprice").value="";
    document.getElementById("ptags").value="";
  };

  window.toggleStock = id => {
    const p = products.find(x => x.id===id);
    if(p) p.stock = !p.stock;
    renderProducts();
    renderAdmin();
  };

  // ---------- CART ----------
  let cart = [];
  window.addToCart = (name, price) => {
    cart.push({name, price});
    updateCart();
  };

  function updateCart() {
    const cartItems = document.getElementById("cart-items");
    let total = 0;
    cartItems.innerHTML = "";
    cart.forEach(item => {
      cartItems.innerHTML += `${item.name} - KES ${item.price}<br>`;
      total += item.price;
    });
    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("cart-total").textContent = `Total: KES ${total}`;
  }

  document.getElementById("checkoutPaybill").onclick = () => {
    if(cart.length===0) return alert("Cart empty");
    document.getElementById("paybill-info").classList.remove("hidden-section");
  };

  document.getElementById("confirmPaymentBtn").onclick = () => {
    if(cart.length===0) return alert("Cart empty");
    let msg = "Payment Confirmation:%0A";
    let total = 0;
    cart.forEach(i => { msg += `${i.name} - KES ${i.price}%0A`; total+=i.price; });
    msg += `Total Paid: KES ${total}`;
    window.open(`https://wa.me/254780328599?text=${msg}`);
  };

  // ---------- HERO SLIDES ----------
  const slides = document.querySelectorAll(".slide");
  let s = 0;
  setInterval(()=>{
    slides.forEach(sl => sl.classList.remove("active"));
    s=(s+1)%slides.length;
    slides[s].classList.add("active");
  },5000);

  // ---------- SPA NAV ----------
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");
  function showPage(id){
    pages.forEach(p=>p.classList.add("hidden-section"));
    if(id!="#home"){ document.querySelector(id)?.classList.remove("hidden-section"); }
    else document.querySelector(".hero").classList.remove("hidden-section");
    navLinks.forEach(l=>l.classList.remove("active"));
    document.querySelector(`a[href="${id}"]`)?.classList.add("active");
    history.pushState(null,"",id);
  }
  navLinks.forEach(l=>l.addEventListener("click", e=>{ e.preventDefault(); showPage(l.getAttribute("href")); }));
  document.getElementById("menuToggle").onclick=()=>document.querySelector("nav").classList.toggle("open");
  document.getElementById("bookServiceBtn").onclick=()=>showPage("#products");

  // ---------- Chatbot (basic) ----------
  const chatHistory = document.getElementById("chat-history");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  chatSend.onclick = sendMessage;
  chatInput.addEventListener('keypress', e => { if(e.key==="Enter") sendMessage(); });

  function addMessage(text,sender){
    const div=document.createElement("div");
    div.className = sender==="user"?"user-msg":"ai-msg";
    div.textContent = text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function sendMessage(){
    const text = chatInput.value.trim();
    if(!text) return;
    addMessage(text,"user");
    chatInput.value="";
    setTimeout(()=> kimaniReply(text),400);
  }

  function kimaniReply(text){
    text = text.toLowerCase();
    let reply = "I did not understand. Try: 'products', 'cart', 'contact'";
    if(text.includes("battery")) reply="Check your hybrid battery connections and charge!";
    else if(text.includes("cooling")) reply="Check cooling fans and coolant levels. I can guide you.";
    else if(text.includes("price") || text.includes("cost")) reply="All product prices are listed on the Products page.";
    addMessage(reply,"ai");
  }
});
