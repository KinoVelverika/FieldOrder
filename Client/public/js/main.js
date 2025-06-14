/** @format */

console.log("main.js loaded and running");

// Index page navigation
const pesanBtn = document.getElementById("pesanBtn");
if (pesanBtn) {
  pesanBtn.addEventListener("click", () => {
    console.log("Navigating to pesan page...");
    window.location.href = "/pesan";
  });
}

const cekBtn = document.getElementById("cekBtn");
if (cekBtn) {
  cekBtn.addEventListener("click", () => {
    console.log("Navigating to kode page...");
    window.location.href = "/kode";
  });
}

// Pesan page navigation
const jadwalBtn = document.getElementById("jadwalBtn");
if (jadwalBtn) {
  jadwalBtn.addEventListener("click", () => {
    console.log("Navigating to pembayaran page...");
    window.location.href = "/pembayaran";
  });
}

const backToHomeBtn = document.getElementById("backToHomeBtn");
if (backToHomeBtn) {
  backToHomeBtn.addEventListener("click", () => {
    console.log("Navigating to home page...");
    window.location.href = "/";
  });
}

// Kode page navigation
const backToHomeBtnKode = document.getElementById("backToHomeBtnKode");
if (backToHomeBtnKode) {
  backToHomeBtnKode.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Navigating to home page from kode...");
    window.location.href = "/";
  });
}

// Pembayaran page navigation
const backToPesanBtn = document.getElementById("backToPesanBtn");
if (backToPesanBtn) {
  backToPesanBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Navigating to pesan page from pembayaran...");
    window.location.href = "/pesan";
  });
}

// Selesai page navigation
const backToHomeBtnSelesai = document.getElementById("backToHomeBtnSelesai");
if (backToHomeBtnSelesai) {
  backToHomeBtnSelesai.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Navigating to home page from selesai...");
    window.location.href = "/";
  });
}

// Check booking function (moved from kode.html)
async function checkBooking() {
  console.log("Checking booking...");
  const bookingCode = document.getElementById("booking-code")?.value.trim().toUpperCase();
  const errorMessage = document.getElementById("error-message");
  const resultDiv = document.getElementById("result");
  const bookingInfo = document.getElementById("booking-info");
  
  if (!bookingCode) {
    errorMessage.textContent = "Harap masukkan kode pemesanan";
    resultDiv.style.display = "none";
    return;
  }

  if (!bookingCode.startsWith("BOOK-") || bookingCode.length < 8) {
    errorMessage.textContent = "Format kode tidak valid";
    resultDiv.style.display = "none";
    return;
  }

  errorMessage.textContent = "";
  
  try {
    const response = await fetch(`/api/bookings/${bookingCode}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Pemesanan tidak ditemukan");
    }
    
    const booking = await response.json();

    // Format tanggal
    const formatDate = (dateStr) => {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    };

    // Format waktu
    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":");
      return `${hours}:${minutes}`;
    };

    // Tampilkan data pemesanan
    bookingInfo.innerHTML = `
      <div class="info-item">
        <span class="info-label">Kode Pemesanan:</span>
        <span>${booking.booking_code}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Lapangan:</span>
        <span>${booking.field_name}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Tanggal:</span>
        <span>${formatDate(booking.booking_date)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Waktu:</span>
        <span>${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Total Pembayaran:</span>
        <span>Rp${booking.total_price.toLocaleString("id-ID")}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Status:</span>
        <span class="status ${booking.status}">
          ${
            booking.status === "pending" ? "Menunggu Verifikasi" :
            booking.status === "paid" ? "Sudah Bayar (Verifikasi)" :
            booking.status === "confirmed" ? "Terkonfirmasi" :
            "Dibatalkan"
          }
        </span>
      </div>
    `;

    resultDiv.style.display = "block";
  } catch (error) {
    console.error("Error:", error);
    errorMessage.textContent = error.message;
    resultDiv.style.display = "none";
  }
}

// Add event listeners for check booking if on kode page
const checkBtn = document.getElementById("check-btn");
if (checkBtn) {
  checkBtn.addEventListener("click", checkBooking);
}

const bookingCodeInput = document.getElementById("booking-code");
if (bookingCodeInput) {
  bookingCodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkBooking();
    }
  });
}


// Admin Navigation Functions
const AdminNav = {
  init: () => {
    console.log('=== INITIALIZING ADMIN NAVIGATION ===');
    
    // Get all admin nav buttons
    const dashboardBtn = document.getElementById('dashboardBtn');
    const ubahjadwalBtn = document.getElementById('ubahjadwalBtn');
    const statusBtn = document.getElementById('statusBtn');
    const riwayatBtn = document.getElementById('riwayatBtn');
    const verifikasiBtn = document.getElementById('verifikasiBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Add click event listeners
    if (dashboardBtn) {
      dashboardBtn.addEventListener('click', () => {
        console.log('Dashboard button clicked');
        window.location.href = '/admin/dashboard';
      });
    }

    if (ubahjadwalBtn) {
      ubahjadwalBtn.addEventListener('click', () => {
        console.log('Ubahjadwal button clicked');
        window.location.href = '/admin/ubahjadwal';
      });
    }

    if (statusBtn) {
      statusBtn.addEventListener('click', () => {
        console.log('Status button clicked');
        window.location.href = '/admin/status';
      });
    }

    if (riwayatBtn) {
      riwayatBtn.addEventListener('click', () => {
        console.log('Riwayat button clicked');
        window.location.href = '/admin/riwayat';
      });
    }

    if (verifikasiBtn) {
      verifikasiBtn.addEventListener('click', () => {
        console.log('Verifikasi button clicked');
        window.location.href = '/admin/verifikasi';
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Logout button clicked');
        AdminAuth.logout();
      });
    }

    // Set active button based on current page
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    
    const activeButton = document.querySelector(`button[data-page="${currentPath.split('/').pop()}"]`);
    if (activeButton) {
      console.log('Setting active button:', activeButton.id);
      document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
      activeButton.classList.add('active');
    }
  }
};

// Admin Authentication Functions
const AdminAuth = {
  login: async (email, password) => {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      
      const response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log('Server response:', data);
      
      if (response.ok && data.success) {
        console.log('=== LOGIN SUCCESS ===');
        // Simpan token ke localStorage
        localStorage.setItem('adminToken', data.token);
        // Redirect ke dashboard
        window.location.href = '/admin/dashboard';
        return true;
      }
      
      console.log('=== LOGIN FAILED ===');
      console.log('Error:', data.message);
      return { error: data.message || 'Login gagal' };
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error details:', error);
      return { error: 'Terjadi kesalahan saat menghubungi server' };
    }
  },

  // Tambahkan fungsi untuk logout
  logout: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('/admin/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      // Hapus token dari localStorage
      localStorage.removeItem('adminToken');
      // Redirect ke halaman login
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Tetap hapus token dan redirect ke login
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
  }
};

// Dashboard Functions
const Dashboard = {
  init: async () => {
    await Dashboard.loadStats();
    await Dashboard.loadRecentActivities();
    // Refresh stats every 30 seconds
    setInterval(Dashboard.loadStats, 30000);
  },

  loadStats: async () => {
    try {
      const response = await fetch('/admin/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Gagal mengambil statistik dashboard');
      }
      const data = await response.json();

      // Update the statistics cards
      document.getElementById('today-bookings').textContent = data.today_total;
      document.getElementById('pending-payments').textContent = data.pending_total;
      document.getElementById('completed-bookings').textContent = data.verified_total;
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  },

  loadRecentActivities: async () => {
    try {
      const response = await fetch('/admin/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Gagal mengambil aktivitas terkini');
      }
      const data = await response.json();
      const activityList = document.getElementById('activity-list');

      if (!data.recent_activities || data.recent_activities.length === 0) {
        activityList.innerHTML = '<p class="no-data">Belum ada aktivitas pemesanan</p>';
        return;
      }

      activityList.innerHTML = data.recent_activities.map(activity => `
        <div class="activity-item">
          <div class="activity-icon">
            <i class="fas ${activity.status === 'verified' ? 'fa-check-circle' : 
                          activity.status === 'pending' ? 'fa-clock' : 
                          'fa-times-circle'}"></i>
          </div>
          <div class="activity-details">
            <p class="activity-title">
              <strong>${activity.customer_name}</strong> memesan lapangan 
              <strong>${activity.field_name}</strong>
            </p>
            <p class="activity-info">
              Kode: ${activity.booking_code} | 
              Tanggal: ${new Date(activity.booking_date).toLocaleDateString('id-ID')} | 
              Waktu: ${activity.time_slot}
            </p>
            <p class="activity-time">
              ${new Date(activity.created_at).toLocaleString('id-ID')}
            </p>
          </div>
          <div class="activity-status ${activity.status}">
            ${activity.status === 'verified' ? 'Terverifikasi' :
              activity.status === 'pending' ? 'Menunggu Verifikasi' :
              'Dibatalkan'}
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading recent activities:', error);
      const activityList = document.getElementById('activity-list');
      activityList.innerHTML = '<p class="error">Gagal memuat aktivitas terkini</p>';
    }
  }
};

// Schedule Management Functions
const Schedule = {
  loadFields: async () => {
    const fieldSelect = document.getElementById('field');
    if (fieldSelect) {
      // Set minimum date to today
      const dateInput = document.getElementById('date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
      }

      // Add event listeners for field and date changes
      const loadSchedulesOnChange = () => {
        if (fieldSelect.value && dateInput.value) {
          Schedule.loadSchedules(fieldSelect.value, dateInput.value);
        }
      };
      
      fieldSelect.addEventListener('change', loadSchedulesOnChange);
      dateInput.addEventListener('change', loadSchedulesOnChange);
    }
  },

  loadSchedules: async (field, date) => {
    console.log('=== LOAD SCHEDULES ===');
    console.log('Field:', field);
    console.log('Date:', date);

    if (!field || !date) return;

    try {
      console.log('Fetching schedules from:', `/api/schedules?field=${field}&date=${date}`);
      const response = await fetch(`/api/schedules?field=${field}&date=${date}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.log('Error response body:', text);
        throw new Error('Gagal memuat jadwal');
      }
      
      const data = await response.json();
      console.log('Schedule data:', data);
      
      const scheduleList = document.getElementById('schedule-list');
      
      if (scheduleList) {
        if (!data || !data.data || data.data.length === 0) {
          scheduleList.innerHTML = '<p class="no-schedule">Belum ada jadwal untuk tanggal ini</p>';
          return;
        }

        scheduleList.innerHTML = data.data.map(schedule => `
          <div class="schedule-item ${schedule.status}">
            <div class="schedule-info">
              <span class="time">${schedule.time_slot}</span>
              <span class="price">Rp ${schedule.price.toLocaleString('id-ID')}</span>
              <span class="status">${schedule.status === 'Available' ? 'Tersedia' : 'Maintenance'}</span>
            </div>
            <div class="schedule-actions">
              <button class="btn btn-sm btn-delete" onclick="Schedule.deleteSchedule(${schedule.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      const scheduleList = document.getElementById('schedule-list');
      if (scheduleList) {
        scheduleList.innerHTML = '<p class="error-message">Gagal memuat jadwal</p>';
      }
    }
  },

  handleSubmit: async (event) => {
    event.preventDefault();
    
    console.log('=== SUBMIT SCHEDULE ===');
    
    const form = event.target;
    const formData = new FormData(form);
    const requestData = {
      field: formData.get('field_id'),
      date: formData.get('date'),
      time_slot: formData.get('time_slot'),
      price: parseInt(formData.get('price')),
      status: formData.get('status')
    };
    
    console.log('Request data:', requestData);
    
    try {
      console.log('Sending POST request to /api/schedules');
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.log('Response body:', text);
        throw new Error('Gagal membuat jadwal');
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success';
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${data.message || 'Jadwal berhasil dibuat'}
      `;
      
      // Insert message before the form
      form.parentNode.insertBefore(successMessage, form);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

      // Reset form
      form.reset();
      
      // Reload schedules
      Schedule.loadSchedules(requestData.field, requestData.date);
      
    } catch (error) {
      console.error('Error creating schedule:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-error';
      errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${error.message}
      `;
      
      // Insert message before the form
      form.parentNode.insertBefore(errorMessage, form);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  },

  deleteSchedule: async (scheduleId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;
    
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menghapus jadwal');
      }

      alert('Jadwal berhasil dihapus');
      
      // Reload schedules
      const fieldId = document.getElementById('field').value;
      const date = document.getElementById('date').value;
      Schedule.loadSchedules(fieldId, date);
      
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert(error.message || 'Gagal menghapus jadwal');
    }
  },

  init: () => {
    const form = document.getElementById('scheduleForm');
    if (form) {
      form.addEventListener('submit', Schedule.handleSubmit);
      
      // Initialize the form
      Schedule.loadFields();
      
      // Add reset button handler
      const resetBtn = document.getElementById('resetBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          form.reset();
          const scheduleList = document.getElementById('schedule-list');
          if (scheduleList) {
            scheduleList.innerHTML = '';
          }
        });
      }
    }
  }
};

// Booking History Functions
const BookingHistory = {
  loadBookings: async (page = 1, filters = {}) => {
    try {
      const response = await fetch('/admin/api/bookings', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Gagal memuat data booking');
      }

      const data = await response.json();
      console.log('Bookings data:', data);
      
      const tableBody = document.querySelector('#bookings-table tbody');
      if (tableBody) {
        if (!data.bookings || data.bookings.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="10" class="text-center">Belum ada data booking</td></tr>';
          return;
        }

        tableBody.innerHTML = data.bookings.map(booking => `
          <tr>
            <td>${booking.booking_code}</td>
            <td>${new Date(booking.booking_date).toLocaleDateString('id-ID')}</td>
            <td>${booking.customer_name}</td>
            <td>${booking.customer_email}</td>
            <td>${booking.customer_phone}</td>
            <td>${booking.field_name}</td>
            <td>${booking.time_slot}</td>
            <td>Rp ${parseFloat(booking.total_price).toLocaleString('id-ID')}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
            <td>
              ${booking.status === 'pending' && booking.payment_proof_path ? `
                <button class="btn btn-sm btn-primary" onclick="BookingHistory.goToVerification('${booking.booking_code}')">
                  <i class="fas fa-check-circle"></i> Verifikasi Pembayaran
                </button>
              ` : ''}
            </td>
          </tr>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      const tableBody = document.querySelector('#bookings-table tbody');
      if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="10" class="text-center error">Gagal memuat data booking</td></tr>';
      }
    }
  },

  goToVerification: (bookingCode) => {
    // Store the booking code in localStorage
    localStorage.setItem('verifyingBookingCode', bookingCode);
    // Navigate to verification page
    window.location.href = '/admin/verifikasi';
  }
};

// Payment Verification Functions
const PaymentVerification = {
  loadBookingDetails: async () => {
    const bookingCode = localStorage.getItem('verifyingBookingCode');
    if (!bookingCode) {
      window.location.href = '/admin/riwayat';
      return;
    }

    try {
      const response = await fetch(`/admin/api/bookings/${bookingCode}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal memuat detail booking');
      }

      const { data: booking } = await response.json();
      console.log('Booking details:', booking);
      
      // Update booking details
      const bookingDetails = document.getElementById('booking-details');
      if (bookingDetails) {
        bookingDetails.innerHTML = `
          <h2>Detail Pemesanan</h2>
          <div class="booking-info">
            <div class="info-item">
              <span class="label">Kode Booking:</span>
              <span>${booking.booking_code}</span>
            </div>
            <div class="info-item">
              <span class="label">Nama Pemesan:</span>
              <span>${booking.customer_name}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span>${booking.customer_email}</span>
            </div>
            <div class="info-item">
              <span class="label">Telepon:</span>
              <span>${booking.customer_phone}</span>
            </div>
            <div class="info-item">
              <span class="label">Lapangan:</span>
              <span>${booking.field_name}</span>
            </div>
            <div class="info-item">
              <span class="label">Tanggal:</span>
              <span>${new Date(booking.booking_date).toLocaleDateString('id-ID')}</span>
            </div>
            <div class="info-item">
              <span class="label">Waktu:</span>
              <span>${booking.time_slot}</span>
            </div>
            <div class="info-item">
              <span class="label">Total Harga:</span>
              <span>Rp ${parseFloat(booking.total_price).toLocaleString('id-ID')}</span>
            </div>
          </div>
        `;
      }

      // Update payment proof
      const paymentProofImage = document.getElementById('payment-proof-image');
      const noProofMessage = document.getElementById('no-proof-message');
      const verifyBtn = document.getElementById('verifyBtn');
      const rejectBtn = document.getElementById('rejectBtn');

      // Always show the buttons if there's a payment proof path
      if (booking.payment_proof_path) {
        // Use the payment_proof_path directly since it's already in the correct format
        const imagePath = booking.payment_proof_path;
        console.log('Loading payment proof from:', imagePath);
        
        paymentProofImage.src = imagePath;
        paymentProofImage.onload = () => {
          console.log('Payment proof image loaded successfully');
          paymentProofImage.style.display = 'block';
          noProofMessage.style.display = 'none';
        };
        paymentProofImage.onerror = (e) => {
          console.error('Error loading payment proof image:', e);
          paymentProofImage.style.display = 'none';
          noProofMessage.textContent = 'Gagal memuat bukti pembayaran';
          noProofMessage.style.display = 'block';
        };

        // Always show the buttons if there's a payment proof path
        verifyBtn.style.display = 'inline-block';
        rejectBtn.style.display = 'inline-block';
      } else {
        paymentProofImage.style.display = 'none';
        noProofMessage.textContent = 'Belum ada bukti pembayaran';
        noProofMessage.style.display = 'block';
        verifyBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
      }

      // Add event listeners for verification buttons
      if (verifyBtn) {
        verifyBtn.onclick = () => PaymentVerification.updateStatus(bookingCode, 'verified');
      }
      if (rejectBtn) {
        rejectBtn.onclick = () => PaymentVerification.updateStatus(bookingCode, 'rejected');
      }

    } catch (error) {
      console.error('Error loading booking details:', error);
      alert('Gagal memuat detail booking');
    }
  },

  updateStatus: async (bookingCode, status) => {
    if (!confirm(`Apakah Anda yakin ingin ${status === 'verified' ? 'menerima' : 'menolak'} pembayaran ini?`)) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/bookings/${bookingCode}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui status pembayaran');
      }

      alert(`Pembayaran berhasil ${status === 'verified' ? 'diverifikasi' : 'ditolak'}`);
      window.location.href = '/admin/riwayat';

    } catch (error) {
      console.error('Error updating payment status:', error);
      alert(error.message || 'Gagal memperbarui status pembayaran');
    }
  }
};

// Utility Functions
const getStatusText = (status) => {
  return status; // Just return the raw status from database
};

// Initialize page based on current route
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== PAGE LOAD ===');
  console.log('Current URL:', window.location.href);
  
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  // Initialize admin navigation if on admin pages
  if (currentPath.startsWith('/admin')) {
    console.log('=== ADMIN PAGE DETECTED ===');
    AdminNav.init();
  }

  // Initialize login form if on login page
  if (currentPath === '/admin/login') {
    console.log('=== INITIALIZING LOGIN FORM ===');
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('=== LOGIN FORM SUBMITTED ===');
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const errorMessage = document.getElementById('error-message');
        
        if (submitBtn) submitBtn.disabled = true;
        if (errorMessage) errorMessage.textContent = '';
        
        try {
          const email = document.getElementById('email').value.trim();
          const password = document.getElementById('password').value.trim();
          
          console.log('Login attempt with email:', email);
          const result = await AdminAuth.login(email, password);
          
          if (result.error) {
            throw new Error(result.error);
          }
        } catch (error) {
          console.error('Login form error:', error);
          if (errorMessage) {
            errorMessage.textContent = error.message || 'Login gagal';
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  } else if (currentPath === '/admin/dashboard') {
    // Tunggu sebentar sebelum memuat data dashboard
    setTimeout(() => {
      Dashboard.init();
    }, 100);
  } else if (currentPath === '/admin/ubahjadwal') {
    Schedule.init();
  } else if (currentPath === '/admin/riwayat') {
    BookingHistory.loadBookings();
  } else if (currentPath === '/admin/verifikasi') {
    PaymentVerification.loadBookingDetails();
  }
});
