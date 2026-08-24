// cart-sidebar.js - 侧边栏购物车控制

document.addEventListener('DOMContentLoaded', function() {
    // DOM 
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartContent = document.getElementById('cartSidebarContent');
    const cartBadge = document.getElementById('cartBadge');

    // Open Cart
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
        renderSidebarCart(); // 渲染购物车内容
    }

    // Close Cart
    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复滚动
    }

    // Switch 
    function toggleCart() {
        if (cartSidebar.classList.contains('open')) {
            closeCart();
        } else {
            openCart();
        }
    }

    // Event Listener
    cartToggleBtn.addEventListener('click', toggleCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // ESC close shopping side cart
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
            closeCart();
        }
    });

    // ==========================================
    // Render Sidebar Cart
    // ==========================================
    function renderSidebarCart() {
        const items = cart.items;
        const content = cartContent;
        const footer = document.getElementById('cartSidebarFooter');

        if (items.length === 0) {
            content.innerHTML = `
                <div class="empty-cart-message">
                    <p>🛒 Your cart is empty</p>
                    <p>✨ Start shopping!</p>
                </div>
            `;
            // hide footer（when the cart is empty）
            footer.style.display = 'none';
            updateSidebarBadge();
            return;
        }

        // show footer
        footer.style.display = 'block';

        // render product list
        let html = '';
        items.forEach(item => {
            const subtotal = item.price * item.quantity;
            const imageUrl = item.image || 'https://via.placeholder.com/70/F8AD9D/FFFFFF?text=✨';
            
            html += `
                <div class="sidebar-cart-item" data-id="${item.id}">
                    <img src="${imageUrl}" alt="${item.name}" 
                         onerror="this.src='https://via.placeholder.com/70/F8AD9D/FFFFFF?text=✨'">
                    <div class="sidebar-item-info">
                        <div class="sidebar-item-name">${item.name}</div>
                        <div class="sidebar-item-price">SEK ${item.price.toFixed(2)}</div>
                        <div class="sidebar-item-controls">
                            <button class="sidebar-decrease" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                            <span class="qty">${item.quantity}</span>
                            <button class="sidebar-increase">+</button>
                            <button class="sidebar-item-remove" title="Remove">✕</button>
                        </div>
                    </div>
                </div>
            `;
        });

        content.innerHTML = html;

        // bind events
        content.querySelectorAll('.sidebar-cart-item').forEach(itemElement => {
            const id = parseInt(itemElement.dataset.id);
            const decreaseBtn = itemElement.querySelector('.sidebar-decrease');
            const increaseBtn = itemElement.querySelector('.sidebar-increase');
            const removeBtn = itemElement.querySelector('.sidebar-item-remove');

            decreaseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = cart.items.find(i => i.id === id);
                if (item && item.quantity > 1) {
                    cart.updateQuantity(id, item.quantity - 1);
                    renderSidebarCart();
                    updateSidebarBadge();
                }
            });

            increaseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = cart.items.find(i => i.id === id);
                if (item) {
                    cart.updateQuantity(id, item.quantity + 1);
                    renderSidebarCart();
                    updateSidebarBadge();
                }
            });

            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                cart.removeItem(id);
                renderSidebarCart();
                updateSidebarBadge();
                // Show Notification
                showNotification('Product has been removed');
            });
        });

        // Update summary
        updateSidebarSummary();
        updateSidebarBadge();
    }

    // ==========================================
    //Update Sidebar Summary 
    // ==========================================
    function updateSidebarSummary() {
        const subtotal = cart.getSubtotal();
        const shipping = cart.getShipping();
        const total = cart.getTotal();

        document.getElementById('sidebarSubtotal').textContent = `SEK ${subtotal.toFixed(2)}`;
        
        const shippingEl = document.getElementById('sidebarShipping');
        if (shipping === 0 && subtotal > 0) {
            shippingEl.innerHTML = 'SEK 0.00 <span class="free-shipping">🎉 Free</span>';
        } else {
            shippingEl.textContent = `SEK ${shipping.toFixed(2)}`;
        }
        
        document.getElementById('sidebarTotal').textContent = `SEK ${total.toFixed(2)}`;
    }

    // ==========================================
    // Update Sidebar Badge
    // ==========================================
    function updateSidebarBadge() {
        const total = cart.getTotalItems();
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = total;
            if (total > 0) {
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        }
    }

    // ==========================================
    // Clear the shopping cart
    // ==========================================
    document.getElementById('sidebarClearBtn').addEventListener('click', function() {
        if (confirm('确定要清空购物车吗？')) {
            cart.clearCart();
            renderSidebarCart();
            updateSidebarBadge();
            showNotification('购物车已清空');
        }
    });

    // ==========================================
    // Checkout button
    // ==========================================
    document.getElementById('sidebarCheckoutBtn').addEventListener('click', function() {
        if (cart.items.length === 0) {
            showNotification('购物车是空的！', 'warning');
            return;
        }
        
        const total = cart.getTotal();
        const items = cart.getTotalItems();
        alert(`🎉 订单已提交！\n\n商品数量: ${items} 件\n总计: SEK ${total.toFixed(2)}\n\n感谢您的购买！`);
        closeCart();
    });

    // ==========================================
    // Show notification
    // ==========================================
    function showNotification(message, type = 'success') {
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };

        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.success};
            color: ${type === 'warning' ? '#333' : 'white'};
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 99999;
            animation: slideIn 0.3s ease;
            font-size: 16px;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }

    // Initilizing: update sidebar badge 
    updateSidebarBadge();

    //  Event Listener- update sidebar badge (when adding the products)
    document.addEventListener('cartUpdated', function() {
        updateSidebarBadge();
        if (cartSidebar.classList.contains('open')) {
            renderSidebarCart();
        }
    });
});

// 在 ShoppingCart 中添加事件触发
// 修改 ShoppingCart.js 的 addItem, removeItem, clearCart, updateQuantity 方法
// 在最后添加: document.dispatchEvent(new Event('cartUpdated'));