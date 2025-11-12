-- Create Database
CREATE DATABASE IF NOT EXISTS tautanrasa;
USE tautanrasa;

-- Create Users table (will be created by Prisma migration)
-- But let's create admin user after migration

-- Sample Categories 
INSERT INTO categories (name, description, status, createdAt, updatedAt) VALUES
('Charm Series', 'Koleksi elegan dengan sentuhan mempesona', 'ACTIVE', NOW(), NOW()),
('Taut Series', 'Rangkaian fashion yang terhubung harmonis', 'ACTIVE', NOW(), NOW()),
('Drawstring Collection', 'Kenyamanan bertemu dengan gaya modern', 'ACTIVE', NOW(), NOW());

-- Sample Products
INSERT INTO products (name, slug, description, price, stock, categoryId, status, createdAt, updatedAt) VALUES
('Tautan Rasa Charm Era - Ballerina Grace', 'ballerina-grace', 'Gelang charm dengan bunga asli dan resin berkualitas tinggi', 177000, 10, 1, 'ACTIVE', NOW(), NOW()),
('Tautan Rasa Charm Era - Ocean Bloom', 'ocean-bloom', 'Gelang charm dengan motif bunga laut yang elegan', 187000, 8, 1, 'ACTIVE', NOW(), NOW()),
('Tautan Rasa Taut - Gentle Rose', 'gentle-rose', 'Gelang taut dengan rose lembut yang mempesona', 177000, 12, 2, 'ACTIVE', NOW(), NOW()),
('Tautan Rasa - Pinkies Bumb', 'pinkies-bumb', 'Tas drawstring dengan aksen pink yang manis', 185000, 5, 3, 'ACTIVE', NOW(), NOW());

-- Admin User (password: admin123)
-- Hash for 'admin123': $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (name, email, password, role, createdAt, updatedAt) VALUES
('Admin User', 'admin@tautanrasa.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', NOW(), NOW());