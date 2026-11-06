import React from 'react';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const WHATSAPP_PHONE = '923154327855';

  const cartTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `Hello Floral Scentora! I would like to place an order for the following items:\n\n`;
    
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (${item.category || 'Luxury'})\n`;
      message += `   Quantity: ${item.quantity} x Rs. ${parseFloat(item.price).toLocaleString()}\n`;
      message += `   Subtotal: Rs. ${(parseFloat(item.price) * item.quantity).toLocaleString()}\n\n`;
    });

    message += `*Total Order Value:* Rs. ${parseFloat(cartTotal).toLocaleString()}\n\n`;
    message += `Please confirm my order and share payment/delivery details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Shopping Bag ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h3>
          <button className="close-drawer-btn" onClick={onClose} aria-label="Close cart">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-items-list">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                </div>
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <span className="cart-item-price">Rs. {parseFloat(item.price).toLocaleString()}</span>
                  
                  <div className="cart-item-qty">
                    <button
                      className="cart-qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                  aria-label={`Remove ${item.name} from bag`}
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </div>
            ))
          ) : (
            <div className="empty-cart-state">
              <i className="fa-solid fa-bag-shopping"></i>
              <p>Your shopping bag is empty.</p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="cart-total-label">Subtotal:</span>
              <span className="cart-total-val">Rs. {parseFloat(cartTotal).toLocaleString()}</span>
            </div>
            <button
              className="btn btn-primary btn-whatsapp-checkout"
              onClick={handleCheckout}
            >
              Checkout on WhatsApp <i className="fa-brands fa-whatsapp"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
