// Fungsi Utama
document.addEventListener('DOMContentLoaded', function() {
  initAdminPanel();
});

function initAdminPanel() {
  // Cek autentikasi
  checkAuth();
  
  // Load data berdasarkan halaman
  const path = window.location.pathname.split('/').pop();
  
  switch(path) {
    case 'dashboard.html':
      loadDashboardData();
      break;
    case 'list.html':
      if(window.location.href.includes('jadwal')) {
        loadScheduleList();
      } else if(window.location.href.includes('pesanan')) {
        loadOrderList();
      } else {
        loadFieldList();
      }
      break;
    case 'detail.html':
      loadOrderDetail();
      break;
    case 'edit.html':
      loadScheduleEdit();
      break;
  }
  
  // Event listeners global
  setupEventListeners();
}

// Fungsi Autentikasi
function checkAuth() {
  const token = localStorage.getItem('adminToken');
  const isLoginPage = window.location.pathname.includes('index.html');
  
  if(!token && !isLoginPage) {
    window.location.href = 'index.html';
  }
  
  if(token && isLoginPage) {
    window.location.href = 'dashboard.html';
  }
}

// Fungsi Dashboard
function loadDashboardData() {
  fetch('/api/admin/dashboard')
    .then(response => response.json())
    .then(data => {
      updateDashboardCards(data);
      setupRealTimeUpdates();
    })
    .catch(error => console.error('Error:', error));
}

function updateDashboardCards(data) {
  document.getElementById('pendingOrdersCount').textContent = data.pending_orders;
  document.getElementById('totalFields').textContent = data.total_fields;
  document.getElementById('todayBookings').textContent = data.today_bookings;
  
  if(data.pending_orders > 0) {
    document.getElementById('ordersCard').classList.add('has-new');
  }
}

// Fungsi List Jadwal
function loadScheduleList() {
  fetch('/api/admin/schedules')
    .then(response => response.json())
    .then(data => {
      renderScheduleList(data);
    });
}

function renderScheduleList(schedules) {
  const container = document.getElementById('scheduleList');
  container.innerHTML = '';
  
  schedules.forEach(schedule => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <h3>${schedule.field_name}</h3>
        <p>${schedule.day}, ${schedule.start_time} - ${schedule.end_time}</p>
      </div>
      <div>
        <span class="price">Rp ${schedule.price.toLocaleString()}</span>
        <a href="edit.html?id=${schedule.id}" class="btn btn-outline">Edit</a>
      </div>
    `;
    container.appendChild(item);
  });
}

// Fungsi Detail Pesanan
function loadOrderDetail() {
  const orderId = new URLSearchParams(window.location.search).get('id');
  
  fetch(`/api/admin/orders/${orderId}`)
    .then(response => response.json())
    .then(data => {
      renderOrderDetail(data);
    });
}

function renderOrderDetail(order) {
  document.getElementById('orderId').textContent = order.order_code;
  document.getElementById('fieldName').textContent = order.field_name;
  document.getElementById('schedule').textContent = `${order.day}, ${order.start_time} - ${order.end_time}`;
  document.getElementById('price').textContent = `Rp ${order.price.toLocaleString()}`;
  document.getElementById('customerName').textContent = order.customer_name;
  document.getElementById('paymentProof').src = order.payment_proof;
  
  // Setup tombol verifikasi
  document.getElementById('approveBtn').addEventListener('click', () => verifyOrder(order.id, true));
  document.getElementById('rejectBtn').addEventListener('click', () => verifyOrder(order.id, false));
}

function verifyOrder(orderId, isApproved) {
  fetch(`/api/admin/orders/${orderId}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: isApproved ? 'approved' : 'rejected' })
  })
  .then(response => {
    if(response.ok) {
      alert(`Pesanan ${isApproved ? 'disetujui' : 'ditolak'}!`);
      window.location.href = 'list.html';
    }
  });
}

// Fungsi Real-time Updates
function setupRealTimeUpdates() {
  // Simulasi dengan polling (dalam real app bisa pakai WebSocket)
  setInterval(() => {
    fetch('/api/admin/updates')
      .then(response => response.json())
      .then(data => {
        if(data.new_orders > 0) {
          notifyNewOrders(data.new_orders);
        }
      });
  }, 30000); // Cek setiap 30 detik
}

function notifyNewOrders(count) {
  const badge = document.getElementById('pendingOrdersBadge');
  badge.textContent = count;
  badge.style.display = 'inline-block';
  
  const card = document.getElementById('ordersCard');
  card.classList.add('has-new');
  
  // Notifikasi browser
  if(Notification.permission === 'granted') {
    new Notification('Pesanan Baru', {
      body: `Ada ${count} pesanan baru menunggu verifikasi`
    });
  }
}

// Event Listeners Global
function setupEventListeners() {
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminToken');
      window.location.href = 'index.html';
    });
  }
  
  // Login Form
  const loginForm = document.getElementById('loginForm');
  if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      authenticateAdmin(username, password);
    });
  }
}

function authenticateAdmin(username, password) {
  fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if(data.token) {
      localStorage.setItem('adminToken', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert('Login gagal: ' + data.message);
    }
  });
}