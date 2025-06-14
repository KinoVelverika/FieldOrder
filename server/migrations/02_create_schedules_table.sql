-- Create schedules table with field as VARCHAR
CREATE TABLE IF NOT EXISTS schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    field VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    price INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_schedule (field, date, time_slot)
); 