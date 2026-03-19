-- SQL Script to set up the local database for Ópticas Blanco
CREATE DATABASE IF NOT EXISTS optica_sistema;
USE optica_sistema;

-- Table sucursales
CREATE TABLE IF NOT EXISTS sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    whatsapp_numero VARCHAR(20) DEFAULT NULL
);

-- Table productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    marca VARCHAR(100),
    imagen_url VARCHAR(255),
    material VARCHAR(150) DEFAULT NULL,
    colores VARCHAR(255) DEFAULT NULL,
    medidas VARCHAR(100) DEFAULT NULL
);

-- Table citas
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(200) NOT NULL,
    email_cliente VARCHAR(200),
    telefono_cliente VARCHAR(50),
    sucursal_id INT,
    fecha DATE,
    hora TIME,
    motivo VARCHAR(100) DEFAULT 'Sin Especificar',
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id)
);

-- Insert initial sucursales
INSERT INTO sucursales (nombre, direccion, whatsapp_numero) VALUES 
('Viña del Mar', 'Galería Rapallo - Av. Valparaíso 518, Local 2', '56912345678'),
('Quilpué', 'Blanco Encalada 992, Local B', '56987654321'),
('La Calera', 'Carrera 988 esq. Huici', '56911223344')
ON DUPLICATE KEY UPDATE direccion=VALUES(direccion);
