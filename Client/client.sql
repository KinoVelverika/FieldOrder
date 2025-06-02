CREATE TABLE fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  status ENUM('available', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE field_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  field_id INT NOT NULL,
  day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'booked', 'maintenance') DEFAULT 'available',
  FOREIGN KEY (field_id) REFERENCES fields(id)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  field_id INT NOT NULL,
  schedule_id INT NOT NULL,
  booking_date DATE NOT NULL,
  status ENUM('pending', 'paid', 'confirmed', 'cancelled') DEFAULT 'pending',
  payment_proof VARCHAR(255),
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (field_id) REFERENCES fields(id),
  FOREIGN KEY (schedule_id) REFERENCES field_schedules(id)
);