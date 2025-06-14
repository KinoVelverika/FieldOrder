// Function to format date to Indonesian day name
function getDayName(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
}

// Function to format price to Indonesian Rupiah
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// Function to format time slot
function formatTimeSlot(startTime, endTime) {
    return `${startTime}-${endTime}`;
}

// Function to create field status card
function createFieldStatusCard(field) {
    const card = document.createElement('div');
    card.className = 'field-status-card';
    
    const statusClass = field.status === 'Available' ? 'status-available' : 'status-booked';
    
    card.innerHTML = `
        <h3>${field.name}</h3>
        <div class="time-slot">
            <i class="fas fa-clock"></i>
            ${field.day}, ${field.timeSlot}
        </div>
        <div class="price">
            <i class="fas fa-tag"></i>
            ${formatPrice(field.price)}
        </div>
        <div class="status ${statusClass}">
            <i class="fas ${field.status === 'Available' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            ${field.status}
        </div>
    `;
    
    return card;
}

// Function to fetch and display field status
async function updateFieldStatus() {
    const dateInput = document.getElementById('filter-date');
    const selectedDate = dateInput.value;
    const fieldsContainer = document.getElementById('fields-status');
    
    try {
        const response = await fetch(`/admin/api/field-status?date=${selectedDate}`);
        
        if (!response.ok) {
            throw new Error('Gagal memuat status lapangan');
        }
        
        const data = await response.json();
        
        // Clear existing content
        fieldsContainer.innerHTML = '';
        
        if (data.length === 0) {
            fieldsContainer.innerHTML = '<p class="no-data">Tidak ada jadwal untuk tanggal ini</p>';
            return;
        }
        
        // Create and append field status cards
        data.forEach(field => {
            const card = createFieldStatusCard(field);
            fieldsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching field status:', error);
        fieldsContainer.innerHTML = '<p class="error-message">Gagal memuat status lapangan</p>';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('filter-date');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Set initial date to today
    dateInput.value = new Date().toISOString().split('T')[0];
    
    // Initial load
    updateFieldStatus();
    
    // Event listener for date change
    dateInput.addEventListener('change', updateFieldStatus);
    
    // Event listener for refresh button
    refreshBtn.addEventListener('click', updateFieldStatus);
}); 