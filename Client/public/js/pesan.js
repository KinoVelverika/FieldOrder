// Fungsi untuk memformat waktu
function formatTimeSlot(timeSlot) {
    const [start, end] = timeSlot.split('-');
    return `${start} - ${end}`;
}

// Fungsi untuk memformat harga
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Fungsi untuk membuat card lapangan
function createFieldCard(field) {
    const card = document.createElement('div');
    card.className = 'field-card';
    
    const schedulesList = field.schedules.map(schedule => `
        <div class="time-slot">
            <i class="fas fa-clock"></i>
            <span>${formatTimeSlot(schedule.time_slot)}</span>
        </div>
        <div class="price">
            <i class="fas fa-tag"></i>
            <span>${formatPrice(schedule.price)}</span>
        </div>
        <div class="status ${schedule.status === 'Available' ? 'status-available' : 'status-maintenance'}">
            <i class="fas ${schedule.status === 'Available' ? 'fa-check-circle' : 'fa-tools'}"></i>
            <span>${schedule.status === 'Available' ? 'Tersedia' : 'Maintenance'}</span>
        </div>
        <button class="btn-book" 
            onclick="bookSchedule('${field.name}', '${schedule.time_slot}', ${schedule.price}, ${schedule.id})"
            style="width: 100%; margin-top: 10px; padding: 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-calendar-plus"></i> Pesan
        </button>
    `).join('');

    card.innerHTML = `
        <h3>${field.name}</h3>
        ${schedulesList}
    `;

    return card;
}

// Fungsi untuk memuat jadwal yang tersedia
async function loadAvailableSchedules() {
    const dateInput = document.getElementById('filter-date');
    const fieldsGrid = document.getElementById('fields-grid');
    const selectedDate = dateInput.value;

    try {
        const response = await fetch(`/api/schedules/available?date=${selectedDate}`);
        if (!response.ok) {
            throw new Error('Gagal mengambil data jadwal');
        }

        const fields = await response.json();
        
        if (fields.length === 0) {
            fieldsGrid.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-calendar-times"></i>
                    <p>Tidak ada jadwal tersedia untuk tanggal ini</p>
                </div>
            `;
            return;
        }

        fieldsGrid.innerHTML = '';
        fields.forEach(field => {
            const card = createFieldCard(field);
            fieldsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        fieldsGrid.innerHTML = `
            <div class="no-data">
                <i class="fas fa-exclamation-circle"></i>
                <p>Terjadi kesalahan saat memuat data</p>
            </div>
        `;
    }
}

// Fungsi untuk melakukan pemesanan
function bookSchedule(fieldName, timeSlot, price, scheduleId) {
    const dateInput = document.getElementById('filter-date');
    const selectedDate = dateInput.value;

    // Redirect ke halaman pembayaran dengan parameter yang diperlukan
    const params = new URLSearchParams({
        field_name: fieldName,
        date: selectedDate,
        start_time: timeSlot.split('-')[0],
        end_time: timeSlot.split('-')[1],
        price: price,
        schedule_id: scheduleId
    });

    window.location.href = `/pembayaran?${params.toString()}`;
}

// Event listener untuk filter tanggal
document.getElementById('filter-date').addEventListener('change', loadAvailableSchedules);

// Load jadwal saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Set tanggal default ke hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date').value = today;
    
    // Load jadwal
    loadAvailableSchedules();
}); 