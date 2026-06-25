// public/js/storefront.js

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update cart count
            const cartCountElement = document.getElementById('cart-count');
            let currentCount = parseInt(cartCountElement.innerText) || 0;
            cartCountElement.innerText = currentCount + quantity;
            
            // Show toast or alert
            alert('Added to cart successfully!');
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart. Please try again.');
    });
}

function updateCart(itemId, quantity) {
    if (quantity < 1) {
        removeFromCart(itemId);
        return;
    }

    fetch('/cart/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify({
            item_id: itemId,
            quantity: parseInt(quantity)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload(); // Simple reload to update totals
        }
    })
    .catch(error => console.error('Error updating cart:', error));
}

function removeFromCart(itemId) {
    if (confirm('Are you sure you want to remove this item?')) {
        fetch('/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify({
                item_id: itemId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            }
        })
        .catch(error => console.error('Error removing from cart:', error));
    }
}
