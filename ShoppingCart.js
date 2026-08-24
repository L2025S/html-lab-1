// cart.js - Shopping Cart Core Functions

class ShoppingCart {
    constructor() {
        this.items = this.loadFromStorage() || [];
        this.shippingCost = 39; // Default shipping cost SEK 39 
        this.freeShippingThreshold = 1_000; // Free shipping on orders over SEK 1000
    }

    // Load data from localStorage
    loadFromStorage() {
        try {
            const data = localStorage.getItem('shoppingCart');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load shopping cart:', error);
            return null;
        }
    }

    // Save to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('shoppingCart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Failed to save shopping cart:', error);
        }
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // If product already exists, increase quantity
            existingItem.quantity += product.quantity || 1;
        } else {
            // New product
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity || 1,
                image: product.image || '',
                maxQuantity: product.maxQuantity || 99
            });
        }
        
        this.saveToStorage();
        this.updateCartBadge();
        document.dispatchEvent(new Event('cartUpdated')); // ✅ ✅ for cart sidebar 
        return this.items;
    }

    // Remove item
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartBadge();
        document.dispatchEvent(new Event('cartUpdated')); // ✅ ✅ for cart sidebar 
        return this.items;
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                return this.removeItem(productId);
            }
            item.quantity = Math.min(newQuantity, item.maxQuantity || 99);
            this.saveToStorage();
            this.updateCartBadge();
            document.dispatchEvent(new Event('cartUpdated')); // ✅ ✅for cart sidebar 
        }
        return this.items;
    }

    // Get total number of items in cart
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart subtotal (total product price)
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get shipping cost
    getShipping() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
    }

    // Get total price
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartBadge();
         document.dispatchEvent(new Event('cartUpdated')); // ✅ ✅for cart sidebar 
        return this.items;
    }

    // Update cart badge
    updateCartBadge() {
        const total = this.getTotalItems();
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = total;
            badge.style.display = total > 0 ? 'inline' : 'none';
        }
    }

    // Get subtotal for a single item
    getItemSubtotal(productId) {
        const item = this.items.find(item => item.id === productId);
        return item ? item.price * item.quantity : 0;
    }
}

// Create global cart instance
const cart = new ShoppingCart();

// Update badge on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartBadge();
});