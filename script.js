// Hotel Data
const rooms = [
    {
        id: 1,
        name: "Deluxe Ocean Suite",
        price: 290,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        description: "Breathtaking ocean views featuring a king-sized bed, private balcony, and marble bathroom."
    },
    {
        id: 2,
        name: "Executive Penthouse",
        price: 550,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
        description: "Ultimate luxury with panoramic cityscapes, separate living room, and personal concierge."
    },
    {
        id: 3,
        name: "Classic King Room",
        price: 180,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        description: "Cozy and sophisticated accommodation equipped with high-speed Wi-Fi and modern amenities."
    }
];

const menuItems = [
    { id: 101, name: "Gourmet Ribeye Steak", price: 45, category: "dining", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80", desc: "Truffle butter infused prime cut." },
    { id: 102, name: "Champagne Moët & Chandon", price: 120, category: "drinks", image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=500&q=80", desc: "Chilled luxury vintage bottle." },
    { id: 103, name: "Full Body Aromatherapy", price: 90, category: "spa", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80", desc: "60-minute relaxing session." },
    { id: 104, name: "Artisan Breakfast Basket", price: 35, category: "dining", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80", desc: "Fresh pastries, fruit, and coffee." }
];

let cart = [];
let bookings = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    renderRooms();
    renderMenu();
    setupEventListeners();
});

// Render Rooms
function renderRooms() {
    const grid = document.getElementById('roomsGrid');
    grid.innerHTML = rooms.map(room => `
        <div class="room-card">
            <img src="${room.image}" alt="${room.name}" class="room-img">
            <div class="room-body">
                <h3>${room.name}</h3>
                <div class="room-price">$${room.price} <span style="font-size:0.85rem; color:#777; font-weight:normal;">/ night</span></div>
                <p class="room-desc">${room.description}</p>
                <button class="btn-primary full-width" onclick="openBookingModal(${room.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Render Pre-Order Menu
function renderMenu() {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <div>
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
            </div>
            <div class="menu-item-footer">
                <span class="menu-price">$${item.price}</span>
                <button class="btn-sm" onclick="addToCart(${item.id})">Add</button>
            </div>
        </div>
    `).join('');
}

// Booking Modal Logic
const modal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close-modal');

function openBookingModal(roomId) {
    const room = rooms.find(r => r.id === roomId);
    document.getElementById('modalRoomTitle').innerText = `Book: ${room.name}`;
    document.getElementById('modalRoomId').value = room.id;
    modal.classList.add('active');
}

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

// Handle Booking Form Submit
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const roomId = parseInt(document.getElementById('modalRoomId').value);
    const room = rooms.find(r => r.id === roomId);
    const name = document.getElementById('guestName').value;
    const email = document.getElementById('guestEmail').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;

    const newBooking = {
        id: Date.now(),
        type: 'room',
        roomName: room.name,
        price: room.price,
        name,
        email,
        checkIn,
        checkOut
    };

    bookings.push(newBooking);
    renderBookings();
    modal.classList.remove('active');
    document.getElementById('bookingForm').reset();
    alert('Room booked successfully! You can view it in "My Bookings".');
});

// Cart Logic
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existing = cart.find(c => c.id === itemId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const submitBtn = document.getElementById('submitOrderBtn');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">No items added yet.</p>';
        document.getElementById('cartTotalPrice').innerText = '$0.00';
        submitBtn.disabled = true;
        return;
    }

    submitBtn.disabled = false;
    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="cart-item-row">
                <span>${item.name} (x${item.qty})</span>
                <span>$${item.price * item.qty} <button onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button></span>
            </div>
        `;
    }).join('');

    document.getElementById('cartTotalPrice').innerText = `$${total.toFixed(2)}`;
}

// Submit Pre-Order
document.getElementById('submitOrderBtn').addEventListener('click', () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const newOrder = {
        id: Date.now(),
        type: 'preorder',
        items: [...cart],
        total
    };

    bookings.push(newOrder);
    cart = [];
    updateCartUI();
    renderBookings();
    alert('Pre-order confirmed! Our concierge is preparing your items.');
});

// Render User Bookings & Orders
function renderBookings() {
    const wrapper = document.getElementById('bookingsWrapper');
    if (bookings.length === 0) {
        wrapper.innerHTML = '<p class="empty-msg">No active bookings found. Book a room above to get started!</p>';
        return;
    }

    wrapper.innerHTML = bookings.map(b => {
        if (b.type === 'room') {
            return `
                <div class="booking-card">
                    <h4><i class="fa-solid fa-bed"></i> ${b.roomName}</h4>
                    <p><strong>Guest:</strong> ${b.name}</p>
                    <p><strong>Dates:</strong> ${b.checkIn} to ${b.checkOut}</p>
                    <p><strong>Rate:</strong> $${b.price} / night</p>
                </div>
            `;
        } else {
            const itemList = b.items.map(i => `${i.name} (x${i.qty})`).join(', ');
            return `
                <div class="booking-card" style="border-left-color: #2ecc71;">
                    <h4><i class="fa-solid fa-utensils"></i> Pre-Order Package</h4>
                    <p><strong>Items:</strong> ${itemList}</p>
                    <p><strong>Total:</strong> $${b.total.toFixed(2)}</p>
                    <p style="color: #2ecc71; font-weight: 600;">Status: Preparing</p>
                </div>
            `;
        }
    }).join('');
}

// Customer Service Chat Widget Logic
function setupEventListeners() {
    const chatToggle = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatCloseBtn');
    const chatSend = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    const botReplies = [
        "I'd be happy to help with that! Is there anything specific you would like to know about our rooms?",
        "Our concierge can assist you with your pre-orders anytime. Would you like a menu recommendation?",
        "Check-in is at 3:00 PM and check-out is at 11:00 AM. Let me know if you need early arrival!",
        "All our luxury suites include complimentary high-speed internet and valet parking."
    ];

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerText = text;
        chatBody.appendChild(userMsg);
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // Bot Response Simulation
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
            botMsg.innerText = randomReply;
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }

    chatSend.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
}