// Al-Qadsiya Khushbuu Mahal - Application Logic (JS)

document.addEventListener('DOMContentLoaded', () => {
  
  // ================= GLOBAL STATE =================
  let cart = [];
  let currentProducts = [];
  let activeCategory = 'all';
  let activeStock = 'all';
  let searchQuery = '';
  let activeSort = 'default';
  
  // Slider State
  let sliderIndex = 0;
  const slideWidth = 310; // Card width + gap (280 + 30)
  
  // Admin Authentication State
  const ADMIN_PASSCODE = 'admin123';
  let isAdminAuthenticated = sessionStorage.getItem('alqadsiya_admin_auth') === 'true';

  // WhatsApp Contact Phone (default placeholder)
  const WHATSAPP_PHONE = '923001234567';

  // ================= INIT APP =================
  function init() {
    // Load products
    currentProducts = getProducts();
    
    // Load cart
    loadCart();

    // Setup routing
    handleRouting();

    // Render components
    renderFeaturedSlider();
    renderCatalog();
    updateCartBadge();
    
    // Setup Custom Cursor
    initCustomCursor();

    // Setup Bespoke Scent Customizer
    initBespokeBuilder();

    // Setup Admin Panel View
    updateAdminView();
  }

  // ================= ROUTING SYSTEM (SPA) =================
  const views = document.querySelectorAll('.view-section');
  const navLinks = document.querySelectorAll('nav a, .logo, .footer-links a, .footer-bottom-links a');
  
  function handleRouting() {
    // Listen to hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1) || 'home';
      switchView(hash);
    });

    // Handle clicks on target buttons
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.clickable');
      if (!trigger) return;

      const target = trigger.getAttribute('data-target');
      const filter = trigger.getAttribute('data-filter');

      if (target) {
        e.preventDefault();
        window.location.hash = target;
        
        // If navigation involves filtering
        if (target === 'catalog' && filter) {
          setCategoryFilter(filter);
        }
      }
    });

    // Initial routing load
    const initialHash = window.location.hash.substring(1) || 'home';
    switchView(initialHash);
  }

  function switchView(viewId) {
    let targetView = document.getElementById(`view-${viewId}`);
    if (!targetView) {
      targetView = document.getElementById('view-home');
      viewId = 'home';
    }

    // Toggle active classes on view containers
    views.forEach(view => {
      view.classList.remove('active');
    });
    
    targetView.classList.add('active');
    
    // Scroll view to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update navbar active link
    const navItems = document.querySelectorAll('#navbar a');
    navItems.forEach(link => {
      const target = link.getAttribute('data-target');
      if (target === viewId) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });

    // Close mobile menu if active
    const navbar = document.getElementById('navbar');
    navbar.classList.remove('mobile-nav-active');

    // Trigger specific rendering updates when entering a view
    if (viewId === 'catalog') {
      currentProducts = getProducts();
      renderCatalog();
    } else if (viewId === 'admin') {
      updateAdminView();
    }
  }

  // Mobile navigation hamburger toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('mobile-nav-active');
    });
  }

  // Shrink header on scroll
  window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ================= CUSTOM INTERACTIVE CURSOR =================
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the center dot
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth elastic trailing cursor logic
    function animateCursor() {
      const easing = 0.15;
      cursorX += (mouseX - cursorX) * easing;
      cursorY += (mouseY - cursorY) * easing;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state expansions
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.clickable, a, button, select, input, textarea, .interactive-card')) {
        cursor.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.clickable, a, button, select, input, textarea, .interactive-card')) {
        cursor.classList.remove('cursor-hover');
      }
    });
  }

  // ================= COMPONENT: FEATURED SLIDER =================
  function renderFeaturedSlider() {
    const sliderTrack = document.getElementById('featured-slider-track');
    if (!sliderTrack) return;

    sliderTrack.innerHTML = '';
    
    // Grab "In Stock" or "Low Stock" perfumes for featured carousel
    const featuredItems = currentProducts.filter(p => p.stockStatus !== 'Out of Stock').slice(0, 5);
    
    if (featuredItems.length === 0) {
      sliderTrack.innerHTML = '<div style="padding:40px; text-align:center; width:100%">No featured perfumes available.</div>';
      return;
    }

    featuredItems.forEach(p => {
      const card = document.createElement('div');
      card.className = 'perfume-card clickable';
      card.style.minWidth = '280px';
      card.style.maxWidth = '280px';
      card.setAttribute('data-target', 'catalog');
      
      card.innerHTML = `
        <div class="card-img-wrapper">
          <span class="card-tag tag-${p.stockStatus.replace(/\s+/g, '').toLowerCase()}">${p.stockStatus}</span>
          <img src="${p.image}" alt="${p.name}">
          <div class="card-overlay">
            <button class="card-btn qv-btn clickable" data-id="${p.id}" title="Quick View"><i class="fa-solid fa-eye"></i></button>
            <button class="card-btn add-cart-btn clickable" data-id="${p.id}" title="Add to Bag" ${p.quantity === 0 ? 'disabled' : ''}><i class="fa-solid fa-bag-shopping"></i></button>
          </div>
        </div>
        <div class="card-info">
          <span class="card-category">${p.category}</span>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-notes">
            <span><strong>Top:</strong> ${p.notes.top}</span>
            <span><strong>Base:</strong> ${p.notes.base}</span>
          </div>
          <div class="card-footer">
            <span class="card-price">$${p.price.toFixed(2)}</span>
            <button class="card-buy-btn add-cart-btn clickable" data-id="${p.id}" ${p.quantity === 0 ? 'disabled' : ''}>
              ${p.quantity === 0 ? 'Sold Out' : 'Add to Bag'}
            </button>
          </div>
        </div>
      `;
      
      sliderTrack.appendChild(card);
    });

    // Slider navigation listeners
    const prevBtn = document.getElementById('featured-prev');
    const nextBtn = document.getElementById('featured-next');
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        if (sliderIndex > 0) {
          sliderIndex--;
          sliderTrack.style.transform = `translateX(-${sliderIndex * slideWidth}px)`;
        }
      });

      nextBtn.addEventListener('click', () => {
        const maxIndex = featuredItems.length - Math.floor(sliderTrack.parentElement.clientWidth / slideWidth);
        if (sliderIndex < maxIndex) {
          sliderIndex++;
          sliderTrack.style.transform = `translateX(-${sliderIndex * slideWidth}px)`;
        }
      });
    }
  }

  // ================= COMPONENT: CATALOG / SHOP =================
  function renderCatalog() {
    const grid = document.getElementById('products-grid-container');
    const countLabel = document.getElementById('products-count-label');
    if (!grid) return;

    grid.innerHTML = '';
    
    // 1. Apply Filtering
    let filtered = currentProducts.filter(p => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      // Stock status filter
      const matchesStock = activeStock === 'all' || p.stockStatus === activeStock;
      // Search query filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(query) || 
                            p.description.toLowerCase().includes(query) || 
                            p.category.toLowerCase().includes(query) ||
                            p.notes.top.toLowerCase().includes(query) ||
                            p.notes.middle.toLowerCase().includes(query) ||
                            p.notes.base.toLowerCase().includes(query);
                            
      return matchesCategory && matchesStock && matchesSearch;
    });

    // 2. Apply Sorting
    if (activeSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 3. Update count label
    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} products`;
    }

    // 4. Render Empty State if no products found
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog">
          <i class="fa-solid fa-wind-warning"></i>
          <h3>No Scents Found</h3>
          <p>Try clearing filters or search to explore our collection.</p>
        </div>
      `;
      return;
    }

    // 5. Build Cards
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'perfume-card';
      
      card.innerHTML = `
        <div class="card-img-wrapper">
          <span class="card-tag tag-${p.stockStatus.replace(/\s+/g, '').toLowerCase()}">${p.stockStatus}</span>
          <img src="${p.image}" alt="${p.name}">
          <div class="card-overlay">
            <button class="card-btn qv-btn clickable" data-id="${p.id}" title="Quick View"><i class="fa-solid fa-eye"></i></button>
            <button class="card-btn add-cart-btn clickable" data-id="${p.id}" title="Add to Bag" ${p.quantity === 0 ? 'disabled' : ''}><i class="fa-solid fa-bag-shopping"></i></button>
          </div>
        </div>
        <div class="card-info">
          <span class="card-category">${p.category}</span>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-notes">
            <span><strong>Top Notes:</strong> ${p.notes.top}</span>
            <span><strong>Middle Notes:</strong> ${p.notes.middle}</span>
            <span><strong>Base Notes:</strong> ${p.notes.base}</span>
          </div>
          <div class="card-footer">
            <span class="card-price">$${p.price.toFixed(2)}</span>
            <button class="card-buy-btn add-cart-btn clickable" data-id="${p.id}" ${p.quantity === 0 ? 'disabled' : ''}>
              ${p.quantity === 0 ? 'Sold Out' : 'Add to Bag'}
            </button>
          </div>
        </div>
      `;
      
      grid.appendChild(card);
    });

    // Add action event listeners inside grid
    setupCardActions();
  }

  // Set category filter triggers
  function setCategoryFilter(category) {
    activeCategory = category;
    
    // Update filter lists highlight
    const catButtons = document.querySelectorAll('#category-filter-list .filter-btn');
    catButtons.forEach(btn => {
      if (btn.getAttribute('data-cat') === category) {
        btn.classList.add('active-filter');
      } else {
        btn.classList.remove('active-filter');
      }
    });

    renderCatalog();
  }

  // Setup catalog sidebar filters listeners
  const searchInput = document.getElementById('search-bar');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Category list filter clicks
  const categoryFilters = document.getElementById('category-filter-list');
  if (categoryFilters) {
    categoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      setCategoryFilter(btn.getAttribute('data-cat'));
    });
  }

  // Stock list filter clicks
  const stockFilters = document.getElementById('stock-filter-list');
  if (stockFilters) {
    stockFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      
      activeStock = btn.getAttribute('data-stock');
      
      const stockButtons = document.querySelectorAll('#stock-filter-list .filter-btn');
      stockButtons.forEach(b => {
        if (b.getAttribute('data-stock') === activeStock) {
          b.classList.add('active-filter');
        } else {
          b.classList.remove('active-filter');
        }
      });

      renderCatalog();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderCatalog();
    });
  }

  // Home category card clicks redirects to catalog with filter
  const homeCategoryCards = document.querySelectorAll('.category-card');
  homeCategoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      if (category) {
        setCategoryFilter(category);
        window.location.hash = 'catalog';
      }
    });
  });

  // Setup product card actions
  function setupCardActions() {
    // Cart add triggers
    const addBtns = document.querySelectorAll('.add-cart-btn');
    addBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        addToCart(id);
      });
    });

    // Quick View triggers
    const qvBtns = document.querySelectorAll('.qv-btn');
    qvBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openQuickView(id);
      });
    });
  }

  // ================= CART OPERATIONS =================
  const cartDrawer = document.getElementById('cart-drawer-overlay');
  const cartTrigger = document.getElementById('cart-trigger-btn');
  const cartClose = document.getElementById('cart-close-btn');

  // Load cart from LocalStorage
  function loadCart() {
    const storedCart = localStorage.getItem('alqadsiya_cart');
    if (storedCart) {
      try {
        cart = JSON.parse(storedCart);
      } catch (e) {
        cart = [];
      }
    }
  }

  // Save cart to LocalStorage
  function saveCart() {
    localStorage.setItem('alqadsiya_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  }

  // Add item
  function addToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product || product.quantity <= 0) return;

    const cartIndex = cart.findIndex(item => item.product.id === productId);
    
    if (cartIndex > -1) {
      // Check stock limits
      if (cart[cartIndex].quantity < product.quantity) {
        cart[cartIndex].quantity++;
      } else {
        showDialog('Stock Limit Reached', `Sorry, we only have ${product.quantity} items of ${product.name} in stock right now.`, 'warning');
        return;
      }
    } else {
      cart.push({ product, quantity: 1 });
    }

    saveCart();
    openCartDrawer();
  }

  // Update item quantity
  function updateCartQty(productId, newQty) {
    const cartIndex = cart.findIndex(item => item.product.id === productId);
    if (cartIndex === -1) return;

    const product = currentProducts.find(p => p.id === productId);
    
    if (newQty <= 0) {
      cart.splice(cartIndex, 1);
    } else if (newQty > product.quantity) {
      showDialog('Stock Limit Reached', `Sorry, we only have ${product.quantity} items of ${product.name} in stock right now.`, 'warning');
      cart[cartIndex].quantity = product.quantity;
    } else {
      cart[cartIndex].quantity = newQty;
    }
    
    saveCart();
  }

  // Remove item
  function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCart();
  }

  // Render items in cart drawer
  function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalLabel = document.getElementById('cart-total-value');
    if (!container) return;

    container.innerHTML = '';
    
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <i class="fa-solid fa-bag-shopping"></i>
          <p>Your shopping bag is empty.</p>
          <button class="btn btn-secondary clickable" id="cart-start-shopping" style="padding:10px 20px; font-size:0.75rem;">Start Shopping</button>
        </div>
      `;
      totalLabel.textContent = '$0.00';
      
      const shoppingBtn = document.getElementById('cart-start-shopping');
      if (shoppingBtn) {
        shoppingBtn.addEventListener('click', () => {
          closeCartDrawer();
          window.location.hash = 'catalog';
        });
      }
      return;
    }

    let subtotal = 0;

    cart.forEach(item => {
      const itemSubtotal = item.product.price * item.quantity;
      subtotal += itemSubtotal;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      
      itemDiv.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.product.image}" alt="${item.product.name}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.product.name}</h4>
          <span class="cart-item-price">$${item.product.price.toFixed(2)}</span>
          <div class="cart-item-qty">
            <button class="cart-qty-btn qty-dec-btn clickable" data-id="${item.product.id}"><i class="fa-solid fa-minus"></i></button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="cart-qty-btn qty-inc-btn clickable" data-id="${item.product.id}"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
        <button class="cart-item-remove clickable" data-id="${item.product.id}" title="Remove Item"><i class="fa-solid fa-trash-can"></i></button>
      `;

      container.appendChild(itemDiv);
    });

    totalLabel.textContent = `$${subtotal.toFixed(2)}`;

    // Setup qty adjustments listeners
    const decBtns = container.querySelectorAll('.qty-dec-btn');
    const incBtns = container.querySelectorAll('.qty-inc-btn');
    const removeBtns = container.querySelectorAll('.cart-item-remove');

    decBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const currentQty = cart.find(item => item.product.id === id).quantity;
        updateCartQty(id, currentQty - 1);
      });
    });

    incBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const currentQty = cart.find(item => item.product.id === id).quantity;
        updateCartQty(id, currentQty + 1);
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    badge.textContent = count;
  }

  function openCartDrawer() {
    cartDrawer.classList.add('active');
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('active');
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCartDrawer);
  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
  if (cartDrawer) {
    cartDrawer.addEventListener('click', (e) => {
      if (e.target === cartDrawer) closeCartDrawer();
    });
  }

  // WhatsApp order compilation checkout
  const whatsappCheckoutBtn = document.getElementById('whatsapp-checkout-btn');
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;

      let message = `*AL-QADSIYA KHUSHBUU MAHAL - ORDER REQUEST*\n`;
      message += `===================================\n`;
      message += `Hello! I would like to order the following perfumes:\n\n`;
      
      let total = 0;
      cart.forEach((item, index) => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. *${item.product.name}* [${item.product.category}]\n`;
        message += `    Qty: ${item.quantity} x $${item.product.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n`;
      });

      message += `\n===================================\n`;
      message += `*Total Order Value: $${total.toFixed(2)}*\n`;
      message += `===================================\n`;
      message += `Please confirm availability and dispatch procedures. Thank you!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
      
      // Open in new tab
      window.open(whatsappURL, '_blank');
    });
  }

  // ================= PRODUCT QUICK VIEW =================
  const qvModal = document.getElementById('quickview-modal-overlay');
  const qvClose = document.getElementById('quickview-close-btn');

  function openQuickView(productId) {
    const p = currentProducts.find(prod => prod.id === productId);
    if (!p) return;

    const modalBody = document.getElementById('quickview-modal-body');
    if (!modalBody) return;

    // Compile Notes list
    modalBody.innerHTML = `
      <div class="qv-img-wrapper">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="qv-details">
        <span class="qv-category">${p.category}</span>
        <h2 class="qv-title">${p.name}</h2>
        <span class="qv-price">$${p.price.toFixed(2)}</span>
        <p class="qv-desc">${p.description}</p>
        
        <div class="qv-specs">
          <div class="qv-spec-item">
            <strong>Longevity</strong>
            <span>${p.longevity}</span>
          </div>
          <div class="qv-spec-item">
            <strong>Sillage Profile</strong>
            <span>${p.sillage}</span>
          </div>
        </div>

        <div class="scent-pyramid-container">
          <div class="pyramid-tier pyramid-tier-top clickable" title="Top Notes: The initial aroma that strikes the senses, lasting 15-30 minutes.">
            <span class="pyramid-label">Top Notes</span>
            <span class="pyramid-value">${p.notes.top}</span>
          </div>
          <div class="pyramid-tier pyramid-tier-middle clickable" title="Heart Notes: The core theme of the fragrance, developing over 2-4 hours.">
            <span class="pyramid-label">Heart Notes</span>
            <span class="pyramid-value">${p.notes.middle}</span>
          </div>
          <div class="pyramid-tier pyramid-tier-base clickable" title="Base Notes: The deep, lasting foundation that lingers for 6-8+ hours.">
            <span class="pyramid-label">Base Notes</span>
            <span class="pyramid-value">${p.notes.base}</span>
          </div>
        </div>

        <div style="margin-top:auto">
          <button class="btn btn-primary clickable qv-add-to-cart-btn" data-id="${p.id}" style="width:100%" ${p.quantity === 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-bag-shopping"></i> ${p.quantity === 0 ? 'Out of Stock' : 'Add to Shopping Bag'}
          </button>
        </div>
      </div>
    `;

    qvModal.classList.add('active');

    // Setup cart add button inside modal
    const qvAddBtn = modalBody.querySelector('.qv-add-to-cart-btn');
    if (qvAddBtn) {
      qvAddBtn.addEventListener('click', () => {
        addToCart(productId);
        qvModal.classList.remove('active');
      });
    }
  }

  if (qvClose) {
    qvClose.addEventListener('click', () => qvModal.classList.remove('active'));
  }
  if (qvModal) {
    qvModal.addEventListener('click', (e) => {
      if (e.target === qvModal) qvModal.classList.remove('active');
    });
  }

  // ================= CONTACT FORM SUBMISSION =================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const scent = document.getElementById('contact-scent').value || 'Not specified';
      const messageText = document.getElementById('contact-message').value;

      // Compile Mailto link
      const subject = `Boutique Inquiry from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\nScent Profile Interest: ${scent}\n\nMessage:\n${messageText}`;
      
      const mailtoURL = `mailto:info@alqadsiyakhushbuu.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open default email composer
      window.location.href = mailtoURL;

      // Reset form and pop thank you dialogue modal
      contactForm.reset();
      showDialog(
        'Inquiry Generated',
        `Thank you ${name}! Your email draft has been generated. Please send it in your mail app, and our olfactory advisors will contact you shortly!`,
        'success'
      );
    });
  }

  // ================= CLIENT ADMIN SECTION =================
  const adminGate = document.getElementById('admin-gate');
  const adminDashboard = document.getElementById('admin-dashboard');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  const adminErrorMsg = document.getElementById('admin-error-msg');

  // Handle Admin Passcode Submit
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('admin-passcode');
      
      if (input.value === ADMIN_PASSCODE) {
        isAdminAuthenticated = true;
        sessionStorage.setItem('alqadsiya_admin_auth', 'true');
        input.value = '';
        adminErrorMsg.style.display = 'none';
        updateAdminView();
        showDialog('Welcome Admin', 'Successfully logged into Al-Qadsiya stock inventory.', 'success');
      } else {
        adminErrorMsg.style.display = 'block';
        input.value = '';
      }
    });
  }

  // Handle Logout
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      isAdminAuthenticated = false;
      sessionStorage.removeItem('alqadsiya_admin_auth');
      updateAdminView();
      showDialog('Logged Out', 'Logged out of admin dashboard session.', 'info');
    });
  }

  // Update administrative elements
  function updateAdminView() {
    if (!adminGate || !adminDashboard) return;

    if (isAdminAuthenticated) {
      adminGate.style.display = 'none';
      adminDashboard.style.display = 'block';
      renderInventoryTable();
      updateDashboardMetrics();
    } else {
      adminGate.style.display = 'flex';
      adminDashboard.style.display = 'none';
    }
  }

  // Update Dashboard Widgets
  function updateDashboardMetrics() {
    const totalItemsLabel = document.getElementById('stat-total-items');
    const lowStockLabel = document.getElementById('stat-low-stock');
    const outStockLabel = document.getElementById('stat-out-stock');
    const totalValLabel = document.getElementById('stat-total-val');

    if (!totalItemsLabel) return;

    const total = currentProducts.length;
    const low = currentProducts.filter(p => p.quantity > 0 && p.quantity <= 5).length;
    const out = currentProducts.filter(p => p.quantity === 0).length;
    
    // Calculate stock worth value (price * qty)
    const totalVal = currentProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);

    totalItemsLabel.textContent = total;
    lowStockLabel.textContent = low;
    outStockLabel.textContent = out;
    totalValLabel.textContent = `$${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Render Admin Stock Table List
  function renderInventoryTable() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (currentProducts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px 0;">No perfumes registered in database.</td></tr>';
      return;
    }

    currentProducts.forEach(p => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>
          <div class="table-prod-info">
            <div class="table-prod-img">
              <img src="${p.image}" alt="${p.name}">
            </div>
            <div>
              <div class="table-prod-name">${p.name}</div>
              <div class="table-prod-brand">${p.brand}</div>
            </div>
          </div>
        </td>
        <td><span class="card-category" style="margin-bottom:0">${p.category}</span></td>
        <td>
          <input type="number" class="table-price-input clickable" data-id="${p.id}" step="0.01" min="0" value="${p.price.toFixed(2)}">
        </td>
        <td>
          <div class="qty-badge-controls">
            <button class="qty-adjust-btn table-qty-dec clickable" data-id="${p.id}"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-val">${p.quantity}</span>
            <button class="qty-adjust-btn table-qty-inc clickable" data-id="${p.id}"><i class="fa-solid fa-plus"></i></button>
          </div>
        </td>
        <td>
          <span class="card-tag tag-${p.stockStatus.replace(/\s+/g, '').toLowerCase()}" style="position:static; padding:4px 8px; font-size:0.6rem;">${p.stockStatus}</span>
        </td>
        <td>
          <div class="action-btns">
            <button class="action-btn action-btn-edit edit-prod-trigger clickable" data-id="${p.id}" title="Edit Profile"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="action-btn action-btn-delete delete-prod-trigger clickable" data-id="${p.id}" title="Delete Perfume"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    setupInventoryActions();
  }

  // Setup admin table listeners (CRUD hooks)
  function setupInventoryActions() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    // 1. Inline Price Updates
    const priceInputs = tbody.querySelectorAll('.table-price-input');
    priceInputs.forEach(input => {
      // Update when user clicks out (blur)
      input.addEventListener('blur', () => {
        const id = input.getAttribute('data-id');
        const newPrice = parseFloat(input.value);
        if (!isNaN(newPrice) && newPrice >= 0) {
          updateProduct(id, { price: newPrice });
          syncDataAndViews();
        } else {
          // Reset to previous value on invalid input
          const original = currentProducts.find(p => p.id === id).price;
          input.value = original.toFixed(2);
        }
      });

      // Update when user presses Enter
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    });

    // 2. Incremental Quantity adjustment
    const decBtns = tbody.querySelectorAll('.table-qty-dec');
    const incBtns = tbody.querySelectorAll('.table-qty-inc');

    decBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const p = currentProducts.find(prod => prod.id === id);
        if (p.quantity > 0) {
          updateProduct(id, { quantity: p.quantity - 1 });
          syncDataAndViews();
        }
      });
    });

    incBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const p = currentProducts.find(prod => prod.id === id);
        updateProduct(id, { quantity: p.quantity + 1 });
        syncDataAndViews();
      });
    });

    // 3. Delete Product Click
    const deleteBtns = tbody.querySelectorAll('.delete-prod-trigger');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const p = currentProducts.find(prod => prod.id === id);
        
        if (confirm(`Are you absolutely sure you want to remove "${p.name}" from your perfume inventory?`)) {
          deleteProduct(id);
          // If deleted product was in cart, remove it
          cart = cart.filter(item => item.product.id !== id);
          saveCart();
          syncDataAndViews();
          showDialog('Product Deleted', `"${p.name}" was successfully removed from catalog.`, 'success');
        }
      });
    });

    // 4. Edit Product Form Trigger
    const editBtns = tbody.querySelectorAll('.edit-prod-trigger');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openCrudModal(id);
      });
    });
  }

  // Sync state between DB, Local vars, and render outputs
  function syncDataAndViews() {
    currentProducts = getProducts();
    
    // Sync cart references (if price changed or stock status changed)
    cart.forEach(item => {
      const match = currentProducts.find(p => p.id === item.product.id);
      if (match) {
        item.product = match;
        // Cap quantity to new stock levels if stock reduced below cart size
        if (item.quantity > match.quantity) {
          item.quantity = match.quantity;
        }
      }
    });
    // Remove items that have been set to 0 quantity in cart
    cart = cart.filter(item => item.quantity > 0);
    saveCart();

    renderCatalog();
    renderFeaturedSlider();
    renderInventoryTable();
    updateDashboardMetrics();
  }

  // ================= CRUD ADD/EDIT MODAL FORM =================
  const crudModal = document.getElementById('perfume-modal-overlay');
  const crudClose = document.getElementById('perfume-modal-close');
  const crudCancel = document.getElementById('perfume-modal-cancel');
  const crudForm = document.getElementById('perfume-crud-form');
  const crudModalTitle = document.getElementById('perfume-modal-title');
  const addProductBtn = document.getElementById('add-product-trigger-btn');

  function openCrudModal(productId = null) {
    if (!crudModal) return;

    crudForm.reset();

    if (productId) {
      // EDIT MODE
      const p = currentProducts.find(prod => prod.id === productId);
      if (!p) return;

      crudModalTitle.textContent = `Edit Fragrance: ${p.name}`;
      document.getElementById('crud-product-id').value = p.id;
      document.getElementById('crud-name').value = p.name;
      document.getElementById('crud-category').value = p.category;
      document.getElementById('crud-price').value = p.price;
      document.getElementById('crud-quantity').value = p.quantity;
      document.getElementById('crud-longevity').value = p.longevity || '';
      document.getElementById('crud-sillage').value = p.sillage || '';
      document.getElementById('crud-notes-top').value = p.notes.top;
      document.getElementById('crud-notes-middle').value = p.notes.middle;
      document.getElementById('crud-notes-base').value = p.notes.base;
      document.getElementById('crud-image').value = p.image;
      document.getElementById('crud-description').value = p.description;
      
      document.getElementById('perfume-modal-submit-btn').textContent = 'Save Changes';
    } else {
      // ADD MODE
      crudModalTitle.textContent = 'Add New Perfume';
      document.getElementById('crud-product-id').value = '';
      document.getElementById('perfume-modal-submit-btn').textContent = 'Add Product';
    }

    crudModal.classList.add('active');
  }

  // Submit CRUD Form
  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const id = document.getElementById('crud-product-id').value;
      
      const productData = {
        name: document.getElementById('crud-name').value,
        category: document.getElementById('crud-category').value,
        price: parseFloat(document.getElementById('crud-price').value),
        quantity: parseInt(document.getElementById('crud-quantity').value, 10),
        longevity: document.getElementById('crud-longevity').value,
        sillage: document.getElementById('crud-sillage').value,
        notesTop: document.getElementById('crud-notes-top').value,
        notesMiddle: document.getElementById('crud-notes-middle').value,
        notesBase: document.getElementById('crud-notes-base').value,
        image: document.getElementById('crud-image').value,
        description: document.getElementById('crud-description').value
      };

      if (id) {
        // Edit Operation
        updateProduct(id, productData);
        showDialog('Product Updated', `"${productData.name}" has been modified successfully.`, 'success');
      } else {
        // Add Operation
        const newProduct = addProduct(productData);
        showDialog('Product Created', `"${productData.name}" has been registered in the database catalog.`, 'success');
      }

      crudModal.classList.remove('active');
      syncDataAndViews();
    });
  }

  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => openCrudModal());
  }
  if (crudClose) {
    crudClose.addEventListener('click', () => crudModal.classList.remove('active'));
  }
  if (crudCancel) {
    crudCancel.addEventListener('click', () => crudModal.classList.remove('active'));
  }
  if (crudModal) {
    crudModal.addEventListener('click', (e) => {
      if (e.target === crudModal) crudModal.classList.remove('active');
    });
  }

  // ================= GENERAL DIALOG DIALOGUE MODAL =================
  const dialogOverlay = document.getElementById('dialog-modal-overlay');
  const dialogOk = document.getElementById('dialog-ok-btn');

  function showDialog(title, message, type = 'success') {
    const dialogTitle = document.getElementById('dialog-title');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogIcon = document.getElementById('dialog-icon');

    if (!dialogOverlay) return;

    dialogTitle.textContent = title;
    dialogMessage.textContent = message;

    // Customize icons & colors based on notification style
    if (type === 'success') {
      dialogIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      dialogIcon.style.color = 'var(--accent-whatsapp)';
    } else if (type === 'warning') {
      dialogIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
      dialogIcon.style.color = 'var(--accent-gold)';
    } else if (type === 'error') {
      dialogIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
      dialogIcon.style.color = '#D81B60';
    } else {
      dialogIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
      dialogIcon.style.color = 'var(--accent-email)';
    }

    dialogOverlay.classList.add('active');
  }

  if (dialogOk) {
    dialogOk.addEventListener('click', () => dialogOverlay.classList.remove('active'));
  }
  if (dialogOverlay) {
    dialogOverlay.addEventListener('click', (e) => {
      if (e.target === dialogOverlay) dialogOverlay.classList.remove('active');
    });
  }

  // ================= OLFACTORY BESPOKE CUSTOM SCENT BUILDER =================
  function initBespokeBuilder() {
    const bespokeForm = document.getElementById('bespoke-form');
    if (!bespokeForm) return;

    const labelInput = document.getElementById('bespoke-label-input');
    const svgLabel = document.getElementById('svg-bottle-label');
    const shapeBtns = document.querySelectorAll('[id^="shape-btn-"]');
    const colorDots = document.querySelectorAll('.color-dot');
    
    // State indicators
    let selectedShape = 'cube';
    let selectedColor = 'pink';

    // 1. Live label typography updates
    if (labelInput && svgLabel) {
      labelInput.addEventListener('input', (e) => {
        const text = e.target.value.trim();
        svgLabel.textContent = text ? text.toUpperCase() : 'SIGNATURE AURA';
      });
    }

    // 2. Shape Cut customizer
    shapeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const shape = btn.getAttribute('data-shape');
        selectedShape = shape;

        // Toggle active button style
        shapeBtns.forEach(b => b.classList.remove('active-shape-btn'));
        btn.classList.add('active-shape-btn');

        // Toggle SVG shapes paths visibility
        const shapes = ['cube', 'cylinder', 'flask'];
        shapes.forEach(s => {
          const glassPath = document.getElementById(`shape-${s}-glass`);
          const fluidPath = document.getElementById(`shape-${s}-fluid`);
          if (glassPath && fluidPath) {
            if (s === shape) {
              glassPath.style.display = 'block';
              fluidPath.style.display = 'block';
            } else {
              glassPath.style.display = 'none';
              fluidPath.style.display = 'none';
            }
          }
        });
      });
    });

    // 3. Fluid Tint customizer
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const color = dot.getAttribute('data-color');
        selectedColor = color;

        // Toggle active dot style
        colorDots.forEach(d => d.classList.remove('active-color'));
        dot.classList.add('active-color');

        // Update fluid fill gradients on all SVG paths
        const shapes = ['cube', 'cylinder', 'flask'];
        shapes.forEach(s => {
          const fluidPath = document.getElementById(`shape-${s}-fluid`);
          if (fluidPath) {
            fluidPath.setAttribute('fill', `url(#fluid-${color}-grad)`);
          }
        });
      });
    });

    // 4. Note limits logic (Max 2 selections per tier)
    const setupCheckboxLimiter = (gridId) => {
      const grid = document.getElementById(gridId);
      if (!grid) return;

      const checkboxes = grid.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          const checked = grid.querySelectorAll('input[type="checkbox"]:checked');
          
          // Toggle checked visual pill state
          if (cb.checked) {
            cb.closest('.note-checkbox-label').classList.add('note-checked');
          } else {
            cb.closest('.note-checkbox-label').classList.remove('note-checked');
          }

          if (checked.length > 2) {
            cb.checked = false;
            cb.closest('.note-checkbox-label').classList.remove('note-checked');
            showDialog('Selection Limit', 'For balanced olfactory notes, please select a maximum of 2 ingredients per tier.', 'warning');
          }
        });
      });
    };

    setupCheckboxLimiter('bespoke-top-grid');
    setupCheckboxLimiter('bespoke-heart-grid');
    setupCheckboxLimiter('bespoke-base-grid');

    // 5. Submit formulation to WhatsApp
    bespokeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const customName = labelInput.value.trim() || 'Signature Aura';
      
      // Collect selected notes
      const getSelectedValues = (gridId) => {
        const checked = document.querySelectorAll(`#${gridId} input[type="checkbox"]:checked`);
        return Array.from(checked).map(cb => cb.value);
      };

      const topNotes = getSelectedValues('bespoke-top-grid');
      const heartNotes = getSelectedValues('bespoke-heart-grid');
      const baseNotes = getSelectedValues('bespoke-base-grid');

      // Validations
      if (topNotes.length === 0 || heartNotes.length === 0 || baseNotes.length === 0) {
        showDialog('Incomplete Scent', 'Please select at least 1 note from each level (Top, Heart, and Base) to balance your perfume composition.', 'warning');
        return;
      }

      // Compile WhatsApp text
      let text = `*AL-QADSIYA KHUSHBUU MAHAL - BESPOKE PERFUME ORDER REQUEST*\n`;
      text += `===================================\n`;
      text += `Hello! I would like to order my custom signature scent formulation:\n\n`;
      text += `*Perfume Custom Name*: "${customName}"\n`;
      text += `*Glass Bottle Shape*: ${selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1)} Cut\n`;
      text += `*Fluid Tint Shade*: ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} Pastel\n\n`;
      
      text += `*Olfactory Composition*:\n`;
      text += `- *Top Notes*: ${topNotes.join(', ')}\n`;
      text += `- *Heart Notes*: ${heartNotes.join(', ')}\n`;
      text += `- *Base Notes*: ${baseNotes.join(', ')}\n`;
      text += `===================================\n`;
      text += `Please send me the custom mixing quotation and timeline details. Thank you!`;

      const encoded = encodeURIComponent(text);
      const whatsappURL = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
      
      window.open(whatsappURL, '_blank');
      
      // Clear form selections
      bespokeForm.reset();
      document.querySelectorAll('.note-checkbox-label').forEach(label => label.classList.remove('note-checked'));
      svgLabel.textContent = 'SIGNATURE AURA';
      
      // Update SVG back to default shape and color
      document.getElementById('shape-btn-cube').click();
      document.querySelectorAll('.color-dot')[0].click();

      showDialog('Composition Sent', `Bespoke formula "${customName}" has been successfully compiled. Check your WhatsApp to finish checkout!`, 'success');
    });
  }

  // ================= INITIATION RUN =================
  init();
});
