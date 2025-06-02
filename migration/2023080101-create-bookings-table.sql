-- migrations/2023080101-create-bookings-table.sql
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  field_id INT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'canceled') DEFAULT 'pending',
  payment_proof VARCHAR(255),
  booking_code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- Tambahkan index untuk pencarian cepat
CREATE INDEX idx_booking_date ON bookings(booking_date);
CREATE INDEX idx_booking_code ON bookings(booking_code);