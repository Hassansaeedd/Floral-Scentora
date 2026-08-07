import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';

const ITEMS_PER_PAGE = 24;

const CatalogPage = ({ products, onQuickView, onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');
  const [sortOption, setSortOption] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [brandSearch, setBrandSearch] = useState('');

  // Synchronize category state with URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    setSelectedCategory(categoryParam || 'All');
    setCurrentPage(1);
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedStock, sortOption]);

  // Extract unique categories sorted alphabetically
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))].sort();
    return ['All', ...cats];
  }, [products]);

  // Filtered categories list for sidebar search
  const filteredCategories = useMemo(() => {
    if (!brandSearch) return categories;
    return ['All', ...categories.slice(1).filter(c =>
      c.toLowerCase().includes(brandSearch.toLowerCase())
    )];
  }, [categories, brandSearch]);

  const stockStatuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const q = search.toLowerCase();
        const matchesSearch = !q ||
          product.name?.toLowerCase().includes(q) ||
          product.description?.toLowerCase().includes(q) ||
          product.brand?.toLowerCase().includes(q) ||
          product.notes_top?.toLowerCase().includes(q) ||
          product.notes_middle?.toLowerCase().includes(q) ||
          product.notes_base?.toLowerCase().includes(q);

        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesStock = selectedStock === 'All' || product.stock_status === selectedStock;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        if (sortOption === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
        if (sortOption === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
        return 0;
      });
  }, [products, search, selectedCategory, selectedStock, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    if (currentPage - delta > 2) pages.unshift('...');
    if (currentPage + delta < totalPages - 1) pages.push('...');
    if (totalPages > 1) {
      pages.unshift(1);
      if (totalPages > 1) pages.push(totalPages);
    }
    return [...new Set(pages)];
  };

  return (
    <div className="view-section active" id="view-catalog" style={{ paddingTop: '120px' }}>
      <div className="section-header">
        <span className="section-subtitle" style={{ color: 'var(--accent-gold)' }}>Bespoke Collection</span>
        <h2 className="section-title">Floral Scentora Shop</h2>
        <p className="section-desc" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Explore our complete collection of luxury fragrances crafted with fine botanical oils.
        </p>
      </div>


      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <aside className="filters-panel">
          <div className="filter-group">
            <h4 className="filter-title">Search Fragrances</h4>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search names, notes, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">
              Brand / Category
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '6px' }}>
                ({categories.length - 1} brands)
              </span>
            </h4>
            {/* Brand search within sidebar */}
            <div className="search-wrapper" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Filter brands..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem 0.4rem 2rem' }}
              />
              <i className="fa-solid fa-tag" style={{ fontSize: '0.75rem' }}></i>
            </div>
            <ul className="filter-list" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {filteredCategories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`filter-btn ${selectedCategory === cat ? 'active-filter' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>{cat}</span>
                    <span style={{ flexShrink: 0 }}>
                      ({cat === 'All'
                        ? products.length
                        : products.filter((p) => p.category === cat).length})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Stock Status</h4>
            <ul className="filter-list">
              {stockStatuses.map((status) => (
                <li key={status}>
                  <button
                    className={`filter-btn ${selectedStock === status ? 'active-filter' : ''}`}
                    onClick={() => setSelectedStock(status)}
                  >
                    <span>{status}</span>
                    <span>
                      ({status === 'All'
                        ? products.length
                        : products.filter((p) => p.stock_status === status).length})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid and Header */}
        <div className="catalog-content">
          <div className="catalog-header">
            <span className="products-count">
              Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{' '}
              {filteredProducts.length} fragrances
            </span>
            <select
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name-asc">Name (A – Z)</option>
              <option value="name-desc">Name (Z – A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-bar">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                    ) : (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'page-active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-catalog">
              <i className="fa-regular fa-face-frown-open"></i>
              <h3>No Perfumes Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Try adjusting your search query or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
