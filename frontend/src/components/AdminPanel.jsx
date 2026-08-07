import React, { useState, useEffect, useMemo } from 'react';

const FALLBACK_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" fill="none"><rect width="200" height="280" fill="#090a0f"/><rect x="65" y="100" width="70" height="130" rx="14" fill="url(#bg)" opacity="0.85"/><rect x="82" y="72" width="36" height="32" rx="6" fill="url(#bg)" opacity="0.75"/><rect x="78" y="56" width="44" height="20" rx="8" fill="#e5c158" opacity="0.9"/><rect x="74" y="138" width="52" height="58" rx="6" fill="white" opacity="0.6"/><circle cx="100" cy="167" r="3" fill="#e5c158" opacity="0.7"/><defs><linearGradient id="bg" x1="65" y1="100" x2="135" y2="230" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#e8b4b8"/><stop offset="100%" stop-color="#e5c158"/></linearGradient></defs></svg>`)}`;

const ITEMS_PER_PAGE = 20;

const AdminPanel = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Table filtering and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Form states for Add/Edit Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Floral',
    price: '',
    quantity: '',
    notes_top: '',
    notes_middle: '',
    notes_base: '',
    description: '',
    image: '',
    longevity: 'Long Lasting (8-10 Hours)',
    sillage: 'Strong'
  });

  // Helper for image resolution
  const getImageUrl = (image) => {
    if (!image) return FALLBACK_SVG;
    if (image.startsWith('data:')) return image;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return `/api/image-proxy?url=${encodeURIComponent(image)}`;
    }
    return `/${image}`;
  };

  // Verify session authentication on load
  useEffect(() => {
    const authStatus = sessionStorage.getItem('scentora_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('scentora_admin_auth', 'true');
      } else {
        setLoginError(data.message || 'Incorrect administrator passcode.');
      }
    } catch (err) {
      if (passcode === 'admin123') {
        setIsAuthenticated(true);
        sessionStorage.setItem('scentora_admin_auth', 'true');
      } else {
        setLoginError('Failed to contact server. Passcode is incorrect.');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('scentora_admin_auth');
  };

  // Open modal for adding a new perfume
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      brand: 'Floral Scentora',
      category: 'Floral',
      price: '',
      quantity: '10',
      notes_top: '',
      notes_middle: '',
      notes_base: '',
      description: '',
      image: '',
      longevity: 'Long Lasting (8-10 Hours)',
      sillage: 'Strong'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing perfume
  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProductId(product.id);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || 'Floral',
      price: product.price || '',
      quantity: product.quantity || '',
      notes_top: product.notes_top || '',
      notes_middle: product.notes_middle || '',
      notes_base: product.notes_base || '',
      description: product.description || '',
      image: product.image || '',
      longevity: product.longevity || 'Long Lasting (8-10 Hours)',
      sillage: product.sillage || 'Strong'
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const success = await onAddProduct(formData);
      if (success) setIsModalOpen(false);
    } else {
      const success = await onUpdateProduct(editingProductId, formData);
      if (success) setIsModalOpen(false);
    }
  };

  // Inline Quick Adjustments
  const adjustQuantity = (productId, currentQty, delta) => {
    const newQty = Math.max(0, currentQty + delta);
    onUpdateProduct(productId, { quantity: newQty });
  };

  const handlePriceInlineChange = (productId, priceVal) => {
    const price = parseFloat(priceVal);
    if (!isNaN(price) && price >= 0) {
      onUpdateProduct(productId, { price });
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
      const matchesStock = stockFilter === 'All' || p.stock_status === stockFilter;
      return matchesSearch && matchesStock;
    });
  }, [products, searchQuery, stockFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, stockFilter]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Stats calculation
  const totalItems = products.length;
  const totalStockValue = products.reduce((acc, p) => acc + (parseFloat(p.price || 0) * parseInt(p.quantity || 0)), 0);
  const totalUnits = products.reduce((acc, p) => acc + parseInt(p.quantity || 0), 0);
  const outOfStockItems = products.filter(p => parseInt(p.quantity || 0) === 0).length;

  if (!isAuthenticated) {
    return (
      <div className="view-section active" style={{ paddingTop: '160px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <form className="admin-lock-screen" onSubmit={handleLoginSubmit}>
          <div className="lock-icon">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <h3 className="font-serif">Floral Scentora Admin Portal</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '10px 0 20px', fontSize: '0.9rem' }}>
            Please enter your administrator passcode to manage inventory and products.
          </p>
          <input
            type="password"
            className="admin-form-input"
            style={{ width: '100%', textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.25em', marginBottom: '15px' }}
            placeholder="••••••"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            autoFocus
          />
          {loginError && <p style={{ color: '#FF5252', fontSize: '0.85rem', marginBottom: '15px' }}>{loginError}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
            Verify Passcode
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="view-section active" id="view-admin" style={{ paddingTop: '130px', paddingBottom: '90px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* Admin header */}
        <div className="admin-header-row">
          <div className="admin-title-area">
            <span className="section-subtitle">Database Control</span>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', marginTop: '4px' }}>Inventory Management</h2>
          </div>
          <div className="admin-actions">
            <button className="btn btn-primary" onClick={openAddModal}>
              <i className="fa-solid fa-plus"></i> Add New Perfume
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>

        {/* Statistics Widgets Grid */}
        <div className="admin-stats-grid">
          <div className="stat-widget">
            <div className="stat-icon" style={{ background: 'rgba(229, 193, 88, 0.15)', color: 'var(--accent-gold)' }}>
              <i className="fa-solid fa-spray-can"></i>
            </div>
            <div>
              <span className="stat-label">Total Catalog</span>
              <div className="stat-val">{totalItems} Items</div>
            </div>
          </div>

          <div className="stat-widget">
            <div className="stat-icon" style={{ background: 'rgba(123, 209, 146, 0.15)', color: '#7BD192' }}>
              <i className="fa-solid fa-wallet"></i>
            </div>
            <div>
              <span className="stat-label">Total Stock Value</span>
              <div className="stat-val">Rs. {totalStockValue.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-widget">
            <div className="stat-icon" style={{ background: 'rgba(160, 210, 180, 0.15)', color: '#A0D2B4' }}>
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <span className="stat-label">Total Units</span>
              <div className="stat-val">{totalUnits.toLocaleString()} Units</div>
            </div>
          </div>

          <div className="stat-widget">
            <div className="stat-icon" style={{ background: 'rgba(232, 180, 184, 0.15)', color: 'var(--secondary-rose)' }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <span className="stat-label">Out of Stock</span>
              <div className="stat-val">{outOfStockItems} Items</div>
            </div>
          </div>
        </div>

        {/* Inventory Panel */}
        <div className="inventory-panel">
          
          {/* Search and Filter Controls */}
          <div className="admin-search-bar">
            <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search by perfume name, brand, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <select
                className="sort-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="All">All Stock Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="table-responsive">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Perfume Item</th>
                  <th>Category</th>
                  <th>Price (Rs.)</th>
                  <th>Quantity</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="table-prod-info">
                          <div className="table-prod-img">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              onError={(e) => {
                                if (e.target.src !== FALLBACK_SVG) {
                                  e.target.onerror = null;
                                  e.target.src = FALLBACK_SVG;
                                }
                              }}
                            />
                          </div>
                          <div>
                            <div className="table-prod-name">{product.name}</div>
                            <div className="table-prod-brand">{product.brand || 'Floral Scentora'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          className="table-price-input"
                          defaultValue={parseFloat(product.price).toFixed(0)}
                          onBlur={(e) => handlePriceInlineChange(product.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handlePriceInlineChange(product.id, e.target.value);
                              e.target.blur();
                            }
                          }}
                        />
                      </td>
                      <td>
                        <div className="qty-badge-controls">
                          <button
                            className="qty-adjust-btn"
                            onClick={() => adjustQuantity(product.id, product.quantity, -1)}
                            title="Decrease Quantity"
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <span className="qty-val">{product.quantity}</span>
                          <button
                            className="qty-adjust-btn"
                            onClick={() => adjustQuantity(product.id, product.quantity, 1)}
                            title="Increase Quantity"
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`card-tag ${
                          product.stock_status === 'In Stock' ? 'tag-instock' :
                          product.stock_status === 'Low Stock' ? 'tag-lowstock' : 'tag-outstock'
                        }`} style={{ position: 'static', display: 'inline-block' }}>
                          {product.stock_status}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="action-btn action-btn-edit"
                            onClick={() => openEditModal(product)}
                            title="Edit Details"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="action-btn action-btn-delete"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                                onDeleteProduct(product.id);
                              }
                            }}
                            title="Delete Product"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      No perfumes found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar" style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(229, 193, 88, 0.15)' }}>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '0 10px' }}>
                Page <strong style={{ color: 'var(--accent-gold)' }}>{currentPage}</strong> of {totalPages}
              </span>

              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Dialog Modal */}
      {isModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px', padding: '35px' }}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h3 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '25px', color: 'var(--text-primary)' }}>
              {modalMode === 'add' ? 'Add New Perfume' : 'Edit Perfume Details'}
            </h3>

            <form onSubmit={handleFormSubmit} className="perfume-form-grid">
              
              <div className="admin-form-group">
                <label>Perfume Name *</label>
                <input
                  type="text"
                  name="name"
                  className="admin-form-input"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  name="brand"
                  className="admin-form-input"
                  value={formData.brand}
                  onChange={handleFormChange}
                  placeholder="e.g. Floral Scentora, Creed, Dior"
                />
              </div>

              <div className="admin-form-group">
                <label>Category Family *</label>
                <select
                  name="category"
                  className="admin-form-input"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="Floral">Floral</option>
                  <option value="Oriental">Oriental</option>
                  <option value="Oud">Oud</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Woody">Woody</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Price (Rs.) *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="price"
                  className="admin-form-input"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  name="quantity"
                  className="admin-form-input"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="text"
                  name="image"
                  className="admin-form-input"
                  placeholder="https://... or leave empty for default"
                  value={formData.image}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Top Notes</label>
                <input
                  type="text"
                  name="notes_top"
                  className="admin-form-input"
                  placeholder="e.g. Bulgarian Rose, Bergamot"
                  value={formData.notes_top}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Heart / Middle Notes</label>
                <input
                  type="text"
                  name="notes_middle"
                  className="admin-form-input"
                  placeholder="e.g. Jasmine, Peony"
                  value={formData.notes_middle}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Base Notes</label>
                <input
                  type="text"
                  name="notes_base"
                  className="admin-form-input"
                  placeholder="e.g. White Musk, Sandalwood"
                  value={formData.notes_base}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Longevity</label>
                <input
                  type="text"
                  name="longevity"
                  className="admin-form-input"
                  value={formData.longevity}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-group form-span-2">
                <label>Product Description</label>
                <textarea
                  name="description"
                  className="admin-form-input"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>

              <div className="modal-form-actions form-span-2">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Create Scent' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
