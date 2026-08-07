import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticlesBg from './components/ParticlesBg';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import CategoryCards from './components/CategoryCards';
import BestSellers from './components/BestSellers';
import ScentQuiz from './components/ScentQuiz';
import EditorialAbout from './components/EditorialAbout';
import CustomerReviews from './components/CustomerReviews';
import SocialGallery from './components/SocialGallery';
import Newsletter from './components/Newsletter';
import CatalogPage from './components/CatalogPage';
import BespokeBuilder from './components/BespokeBuilder';
import ContactPage from './components/ContactPage';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('scentora_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Modals visibility state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('scentora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products from Laravel SQLite backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products from backend:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      // Use explicit selectedQuantity if passed, otherwise default to 1 item (NOT product.quantity stock count!)
      const qtyToAdd = product.selectedQuantity || 1;
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
        );
      }
      return [...prevItems, { ...product, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Admin inventory operations linked to Laravel backend REST API
  const handleAddProduct = async (formData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProducts(); // Refresh state
        return true;
      } else {
        const err = await response.json();
        alert(JSON.stringify(err.errors || err.message));
        return false;
      }
    } catch (error) {
      console.error('Network error creating product:', error);
      return false;
    }
  };

  const handleUpdateProduct = async (productId, updatedFields) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        fetchProducts();
        return true;
      }
    } catch (error) {
      console.error('Network error updating product:', error);
    }
    return false;
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
        return true;
      }
    } catch (error) {
      console.error('Network error deleting product:', error);
    }
    return false;
  };

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="app-container">
        {/* Particle Flow Field canvas background */}
        <ParticlesBg />
        
        {/* Custom lag cursor tracker */}
        <CustomCursor />

        {/* Global navigation header */}
        <Navbar 
          cartCount={totalCartCount} 
          onCartClick={() => setIsCartOpen(true)} 
        />

        {/* View Router */}
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="view-section active" id="view-home">
                  <HeroSection />
                  <CategoryCards />
                  <BestSellers 
                    products={products} 
                    onQuickView={handleOpenQuickView} 
                    onAddToCart={handleAddToCart} 
                  />
                  <ScentQuiz 
                    products={products} 
                    onQuickView={handleOpenQuickView} 
                    onAddToCart={handleAddToCart} 
                  />
                  <EditorialAbout />
                  <CustomerReviews />
                  <SocialGallery />
                  <Newsletter />
                </div>
              } 
            />
            <Route 
              path="/catalog" 
              element={
                <CatalogPage 
                  products={products} 
                  onQuickView={handleOpenQuickView} 
                  onAddToCart={handleAddToCart} 
                />
              } 
            />
            <Route path="/bespoke" element={<BespokeBuilder />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route 
              path="/admin" 
              element={
                <AdminPanel 
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              } 
            />
          </Routes>
        </main>

        {/* Global footer */}
        <Footer />

        {/* Shopping bag drawer slider */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
        />

        {/* Quick View detailed modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </Router>
  );
}

export default App;
