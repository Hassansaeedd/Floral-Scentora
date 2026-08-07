// Product Database and localStorage Manager for Al-Qadsiya Khushbuu Mahal

const DEFAULT_PRODUCTS = [
  {
    id: "prod_rose_whisper",
    name: "Rose Whisper",
    brand: "Al-Qadsiya",
    category: "Floral",
    price: 65.00,
    quantity: 12,
    stockStatus: "In Stock",
    notes: {
      top: "Bulgarian Rose, Bergamot",
      middle: "Jasmine Sambac, Peony",
      base: "White Musk, Ambergris"
    },
    description: "A delicate, romantic fragrance capturing the essence of fresh morning roses in a pastel garden. Elegance in every spray.",
    image: "assets/images/rose_whisper.jpg",
    longevity: "Long Lasting (6-8 hours)",
    sillage: "Moderate"
  },
  {
    id: "prod_oud_subh",
    name: "Oud Al-Subh",
    brand: "Al-Qadsiya",
    category: "Oriental",
    price: 95.00,
    quantity: 4,
    stockStatus: "Low Stock",
    notes: {
      top: "Saffron, Cardamom",
      middle: "Agarwood (Oud), Rose Petals",
      base: "Sandalwood, Vanilla, Patchouli"
    },
    description: "A rich, majestic oriental oud that captures the golden warmth of the morning sun. Mysterious, warm, and deeply comforting.",
    image: "assets/images/oud_subh.jpg",
    longevity: "Eternal (10+ hours)",
    sillage: "Strong"
  },
  {
    id: "prod_lavender_mist",
    name: "Lavender Mist",
    brand: "Al-Qadsiya",
    category: "Fresh",
    price: 55.00,
    quantity: 15,
    stockStatus: "In Stock",
    notes: {
      top: "French Lavender, Mint Leaves",
      middle: "Chamomile, Pear Blossom",
      base: "Cedarwood, Tonka Bean"
    },
    description: "A serene, calming blend of French lavender and crushed mint leaves. Perfect for a refreshing, clean daily scent.",
    image: "assets/images/lavender_mist.jpg",
    longevity: "Moderate (4-6 hours)",
    sillage: "Soft"
  },
  {
    id: "prod_peach_bloom",
    name: "Peachy Bloom",
    brand: "Al-Qadsiya",
    category: "Fruity",
    price: 60.00,
    quantity: 0,
    stockStatus: "Out of Stock",
    notes: {
      top: "White Peach, Nectarine",
      middle: "Freesia, Apricot Blossom",
      base: "Powdery Musk, Coconut"
    },
    description: "A playful, vibrant cocktail of sweet white peaches and soft floral blossoms. Exudes a cheerful, sunny pastel vibe.",
    image: "assets/images/rose_whisper.jpg", // Fallback to rose whisper
    longevity: "Moderate (5-7 hours)",
    sillage: "Moderate"
  },
  {
    id: "prod_minty_breeze",
    name: "Citrus Mint",
    brand: "Al-Qadsiya",
    category: "Citrus",
    price: 70.00,
    quantity: 8,
    stockStatus: "In Stock",
    notes: {
      top: "Amalfi Lemon, Lime, Bergamot",
      middle: "Spearmint, Green Tea",
      base: "Vetiver, White Cedar"
    },
    description: "An invigorating blast of fresh citrus fruits and cool garden mint. Energetic, crisp, and incredibly uplifting.",
    image: "assets/images/lavender_mist.jpg", // Fallback to lavender mist
    longevity: "Moderate (5-6 hours)",
    sillage: "Moderate"
  }
];

// Load products from localStorage or seed them
function getProducts() {
  const stored = localStorage.getItem("alqadsiya_products");
  if (!stored) {
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error parsing stored products, resetting to defaults", e);
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }
}

// Save products to localStorage
function saveProducts(products) {
  localStorage.setItem("alqadsiya_products", JSON.stringify(products));
}

// Automatically calculate stock status based on quantity
function calculateStockStatus(quantity) {
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) return "Out of Stock";
  if (qty <= 5) return "Low Stock";
  return "In Stock";
}

// Add a new product
function addProduct(productData) {
  const products = getProducts();
  
  const newProduct = {
    id: "prod_" + Date.now(),
    name: productData.name || "Untitled Perfume",
    brand: productData.brand || "Al-Qadsiya",
    category: productData.category || "General",
    price: parseFloat(productData.price) || 0.0,
    quantity: parseInt(productData.quantity, 10) || 0,
    stockStatus: calculateStockStatus(productData.quantity),
    notes: {
      top: productData.notesTop || "Not specified",
      middle: productData.notesMiddle || "Not specified",
      base: productData.notesBase || "Not specified"
    },
    description: productData.description || "No description available.",
    image: productData.image || "assets/images/rose_whisper.jpg",
    longevity: productData.longevity || "Moderate",
    sillage: productData.sillage || "Moderate"
  };
  
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

// Update an existing product
function updateProduct(productId, updatedFields) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  
  if (index === -1) return null;
  
  const currentProduct = products[index];
  
  // If quantity is updated, recalculate stockStatus
  let quantity = currentProduct.quantity;
  if (updatedFields.quantity !== undefined) {
    quantity = parseInt(updatedFields.quantity, 10) || 0;
  }
  
  const stockStatus = updatedFields.quantity !== undefined 
    ? calculateStockStatus(quantity) 
    : (updatedFields.stockStatus || currentProduct.stockStatus);

  // Update object fields
  products[index] = {
    ...currentProduct,
    ...updatedFields,
    quantity: quantity,
    stockStatus: stockStatus,
    notes: {
      top: updatedFields.notesTop !== undefined ? updatedFields.notesTop : currentProduct.notes.top,
      middle: updatedFields.notesMiddle !== undefined ? updatedFields.notesMiddle : currentProduct.notes.middle,
      base: updatedFields.notesBase !== undefined ? updatedFields.notesBase : currentProduct.notes.base
    }
  };
  
  saveProducts(products);
  return products[index];
}

// Delete a product
function deleteProduct(productId) {
  let products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) return false;
  
  products.splice(index, 1);
  saveProducts(products);
  return true;
}
