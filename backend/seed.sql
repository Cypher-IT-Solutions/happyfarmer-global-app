-- Users
-- Password hash is for "password" using BCrypt
INSERT INTO users (id, email, password_hash, full_name, role, phone_number, is_active, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'farmer@happy.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qa8qX.2O', 'John Farmer', 'FARMER', '555-0101', true, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'customer@happy.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qa8qX.2O', 'Jane Customer', 'CUSTOMER', '555-0102', true, NOW(), NOW());

-- Farmers
INSERT INTO farmers (id, user_id, farm_name, bio, address, offers_delivery, offers_pickup, is_verified) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Green Valley Farms', 'Family owned since 1990. We grow organic vegetables and fruits.', '123 Country Rd, Valley View, CA', true, true, true);

-- Products
INSERT INTO products (id, farmer_id, name, description, category, price, unit, stock_quantity, active, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Organic Tomatoes', 'Freshly picked red tomatoes.', 'VEGETABLE', 4.99, 'kg', 50, true, NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Free Range Eggs', 'Dozen large brown eggs.', 'DAIRY', 6.50, 'dozen', 20, true, NOW(), NOW());
