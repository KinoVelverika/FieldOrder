-- Create bookings table with all required fields
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    payment_proof_path VARCHAR(255),
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE RESTRICT
);

-- Create indexes for faster searching
CREATE INDEX idx_booking_date ON bookings(booking_date);
CREATE INDEX idx_booking_code ON bookings(booking_code);
CREATE INDEX idx_customer_email ON bookings(customer_email);
CREATE INDEX idx_schedule_id ON bookings(schedule_id); 