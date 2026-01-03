// New Chatbot Functionality
function initializeChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');

  // ===== Hide the chatbot initially =====
  container.style.display = 'none'; // Ensure the chatbot is hidden on load

  // ===== Toggle chatbot =====
  toggle.addEventListener('click', () => {
    container.style.display = 'flex'; // Show the chatbot when toggle is clicked
  });
  
  closeBtn.addEventListener('click', () => {
    container.style.display = 'none'; // Hide the chatbot when close button is clicked
  });

  // ===== Send message =====
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user-message');
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Typing animation
    addMessage('<span class="typing-dots"><span></span><span></span><span></span></span>', 'ai-msg', true);

    setTimeout(() => processMessage(text.toLowerCase()), 600);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  // ===== Add message =====
  function addMessage(text, className, html = false) {
    const typing = messages.querySelector('.typing-dots');
    if (typing) typing.parentElement.remove();

    const div = document.createElement('div');
    div.className = className;
    if (html) div.innerHTML = text;
    else div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // ===== Process user input =====
  function processMessage(inputText) {
    if (inputText.includes('product') || inputText.includes('products')) {
      fetch('products.json')
        .then(res => res.json())
        .then(data => {
          if (!data.length) return addMessage('No products available right now.', 'ai-msg');

          addMessage('Here are our products:', 'ai-msg');

          data.forEach(prod => {
            const content = `
              <div style="border:1px solid #D35400; padding:8px; margin:5px 0; border-radius:8px;">
                <img src="${prod.image}" alt="${prod.name}" style="width:80px; height:80px; object-fit:contain; float:left; margin-right:10px;">
                <strong>${prod.name}</strong><br>
                <small>${prod.description}</small><br>
                <button class="ask-product-btn" data-id="${prod.id}">Ask Expert</button>
                <div style="clear:both;"></div>
              </div>
            `;
            addMessage(content, 'ai-msg', true);
          });

          document.querySelectorAll('.ask-product-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const prodId = btn.dataset.id;
              const prodName = data.find(p => p.id == prodId)?.name || 'product';
              addMessage(`You asked about "${prodName}". Our expert will respond shortly!`, 'ai-msg');
            });
          });
        })
        .catch(() => {
          addMessage('Could not load products. Try again later.', 'ai-msg');
        });

    } else if (inputText.includes('hello') || inputText.includes('hi')) {
      addMessage('Hey! I’m Kimani, your hybrid mechanic. Ask me anything about your vehicle.', 'ai-msg');

    } else if (inputText.includes('location')) {
      showPage('location');
      addMessage('Our main branch is in Nairobi, Kenya. Check the map above.', 'ai-msg');

    } else if (inputText.includes('contact')) {
      showPage('contact');
      addMessage('You can call +254780328599 or WhatsApp us for inquiries.', 'ai-msg');

    } else if (inputText.includes('book')) {
      showPage('booking');
      addMessage('Booking form is now open. Please fill in your details.', 'ai-msg');

    } else {
      addMessage('I did not understand. Type "products", "book", "location", or "contact".', 'ai-msg');
    }
  }
}

// Initialize the chatbot functionality after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeChatbot(); // Call the function to set up the chatbot
});
