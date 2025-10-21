-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-10-2025 a las 08:26:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `botica`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `documento`, `telefono`, `email`, `direccion`, `created_at`) VALUES
(1, 'Manuel', '87953456', '982378347', 'manuel@gmail.com', 'El porvenir ', '2025-10-19 06:36:07'),
(2, 'Pancho', '87953480', '982378389', 'pancho@gmail.com', 'Calle 6 de enero ', '2025-10-19 07:26:46'),
(3, 'Mario', '46589234', '934567893', 'mario@gmail.com', 'Trujillo', '2025-10-19 08:24:49'),
(4, 'Martin ', '87953459', '982378389', 'martinl@gmail.com', 'Trujillo', '2025-10-20 17:14:22'),
(7, 'Camila ', '76090156', '982483815', 'camila@gmail.com', 'Trujillo', '2025-10-20 17:15:55'),
(8, 'Noa', '76090145', '982483812', 'noa@gmail.com', 'Trujillo', '2025-10-20 19:19:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`id`, `venta_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 17, 1, 2.00),
(2, 2, 9, 1, 2.00),
(3, 3, 9, 2, 2.00),
(4, 4, 17, 1, 2.00),
(5, 5, 9, 1, 2.00),
(6, 5, 12, 1, 4.50),
(7, 6, 17, 1, 2.00),
(8, 7, 17, 1, 2.00),
(9, 8, 9, 1, 2.00),
(10, 9, 14, 1, 2.80),
(11, 9, 20, 1, 120.00),
(12, 9, 2, 3, 2.00),
(13, 9, 9, 1, 2.00),
(14, 9, 1, 2, 1.50),
(15, 9, 7, 2, 1.00),
(16, 10, 9, 1, 2.00),
(17, 10, 17, 1, 2.00),
(18, 10, 14, 1, 2.80),
(19, 11, 9, 7, 2.00),
(20, 12, 9, 25, 2.00),
(21, 13, 3, 1, 3.80),
(22, 14, 9, 1, 2.00),
(23, 15, 3, 1, 3.80),
(24, 16, 8, 1, 3.50),
(25, 16, 3, 1, 3.80),
(26, 16, 12, 1, 4.50),
(27, 17, 9, 1, 2.00),
(28, 17, 8, 1, 3.50),
(29, 17, 3, 2, 3.80),
(30, 18, 9, 1, 2.00),
(31, 19, 17, 1, 2.00),
(32, 19, 9, 1, 2.00),
(33, 20, 8, 1, 3.50),
(34, 20, 3, 1, 3.80),
(35, 21, 8, 1, 3.50),
(36, 21, 3, 1, 3.80),
(37, 22, 17, 2, 2.00),
(38, 22, 9, 1, 2.00),
(39, 22, 8, 1, 3.50),
(40, 23, 9, 1, 2.00),
(41, 23, 8, 1, 3.50),
(42, 23, 12, 1, 4.50),
(43, 24, 9, 9, 2.00),
(44, 25, 9, 1, 2.00),
(45, 26, 8, 1, 3.50),
(47, 28, 9, 1, 2.00),
(48, 29, 8, 1, 3.50),
(49, 29, 3, 1, 3.80),
(50, 30, 18, 1, 5.00),
(51, 31, 8, 1, 3.50),
(52, 32, 12, 1, 4.50),
(53, 33, 12, 1, 4.50),
(54, 34, 3, 1, 3.80),
(55, 35, 2, 1, 2.00),
(56, 35, 1, 1, 1.50),
(57, 35, 13, 1, 3.00),
(58, 35, 7, 1, 1.00),
(59, 36, 8, 1, 3.50),
(60, 37, 20, 9, 120.00),
(61, 38, 12, 1, 4.50),
(62, 39, 3, 1, 3.80),
(63, 40, 34, 1, 6.90),
(64, 41, 9, 1, 2.00),
(65, 42, 9, 1, 2.00),
(66, 43, 8, 1, 3.50),
(67, 44, 34, 1, 6.90),
(68, 45, 9, 1, 2.00),
(69, 46, 9, 1, 2.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 5,
  `codigo_barra` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `stock_minimo`, `codigo_barra`, `created_at`) VALUES
(1, 'Paracetamol 500mg', 'Tabletas analgésicas y antipiréticas para el dolor y la fiebre.', 1.50, 117, 10, '7501000000010', '2025-10-18 06:14:02'),
(2, 'Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo para el dolor e inflamación.', 2.00, 96, 10, '7501000000027', '2025-10-18 06:14:02'),
(3, 'Amoxicilina 500mg', 'Antibiótico de amplio espectro para infecciones bacterianas.', 3.80, 70, 10, '7501000000034', '2025-10-18 06:14:02'),
(4, 'Omeprazol 20mg', 'Cápsulas para el tratamiento de la acidez y gastritis.', 2.50, 90, 10, '7501000000041', '2025-10-18 06:14:02'),
(5, 'Loratadina 10mg', 'Antialérgico utilizado para rinitis y urticaria.', 1.20, 75, 8, '7501000000058', '2025-10-18 06:14:02'),
(6, 'Suero Oral 500ml', 'Solución hidratante oral para prevenir deshidratación.', 2.80, 50, 5, '7501000000065', '2025-10-18 06:14:02'),
(7, 'Vitamina C 1g', 'Suplemento vitamínico para fortalecer el sistema inmunológico.', 1.00, 107, 10, '7501000000072', '2025-10-18 06:14:02'),
(8, 'Alcohol 70% 500ml', 'Antiséptico para desinfección de heridas y superficies.', 3.50, 18, 10, '7501000000089', '2025-10-18 06:14:02'),
(9, 'Agua Oxigenada 120ml', 'Desinfectante y limpiador de heridas.', 2.00, 16, 9, '7501000000096', '2025-10-18 06:14:02'),
(10, 'Panadol Niños 120ml', 'Jarabe analgésico y antipirético para niños.', 5.20, 35, 5, '7501000000102', '2025-10-18 06:14:02'),
(11, 'Salbutamol Inhalador 100mcg', 'Broncodilatador para tratamiento del asma.', 12.00, 25, 5, '7501000000119', '2025-10-18 06:14:02'),
(12, 'Crema Antifúngica Clotrimazol 1%', 'Crema para el tratamiento de infecciones por hongos.', 4.50, 24, 5, '7501000000126', '2025-10-18 06:14:02'),
(13, 'Suplemento de Hierro 100mg', 'Cápsulas para prevenir la anemia.', 3.00, 49, 5, '7501000000133', '2025-10-18 06:14:02'),
(14, 'Gel Antibacterial 250ml', 'Gel desinfectante de manos con alcohol etílico 70%.', 2.80, 43, 5, '7501000000140', '2025-10-18 06:14:02'),
(15, 'Mascarilla Quirúrgica (Caja 50u)', 'Mascarillas de 3 capas, desechables.', 9.50, 20, 5, '7501000000157', '2025-10-18 06:14:02'),
(16, 'Toallitas Húmedas Antibacteriales', 'Paquete de 50 unidades con aloe vera.', 4.20, 35, 5, '7501000000164', '2025-10-18 06:14:02'),
(17, 'Acetaminofén 500mg', 'Analgésico y antipirético similar al paracetamol.', 2.00, 63, 5, '7501000000171', '2025-10-18 06:14:02'),
(18, 'Jarabe Ambroxol 120ml', 'Mucolítico y expectorante para la tos.', 5.00, 29, 5, '7501000000188', '2025-10-18 06:14:02'),
(19, 'Vitamina D 1000UI', 'Suplemento para huesos y sistema inmunológico.', 3.80, 40, 5, '7501000000195', '2025-10-18 06:14:02'),
(20, 'Glucómetro Accu-Chek', 'Medidor de glucosa en sangre con 10 tiras reactivas.', 120.00, 0, 5, '7501000000201', '2025-10-18 06:14:02'),
(34, 'Condones ', 'Talla XL', 6.90, 18, 5, '7501000000175', '2025-10-21 05:04:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','vendedor') DEFAULT 'vendedor',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `created_at`) VALUES
(1, 'Admin', 'admin@botica.com', 'admin123', 'admin', '2025-10-18 06:19:57'),
(2, 'Administrador', 'admin@gmail.com', '$2b$10$cfjPz.h3t7fJaGWSjmhET.wsk3q9tcfIO9YXjwUnMgyqU3Jr8rnVO', 'admin', '2025-10-18 07:31:53'),
(3, 'Gino', 'gino@gmail.com', '$2b$10$j3KI73ayc3skAQxv4iE3auRud5EGBWsMByO5FitGVXPMC32pUGG8O', 'vendedor', '2025-10-19 06:05:01'),
(4, 'Pablo', 'pablo@gmail.com', '$2b$10$kCON.qVMsQhWZMs0PHYJ3.rAEqz9m1tRXG4Tl5wzAL80G4nWpQtpm', 'vendedor', '2025-10-20 17:13:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `usuario_id`, `cliente_id`, `fecha`, `total`) VALUES
(1, 2, NULL, '2025-10-18 08:50:03', 2.00),
(2, 2, NULL, '2025-10-18 08:50:45', 2.00),
(3, 2, NULL, '2025-10-18 08:51:12', 4.00),
(4, 2, NULL, '2025-10-18 09:09:47', 2.00),
(5, 2, NULL, '2025-10-18 09:09:59', 6.50),
(6, 2, NULL, '2025-10-18 09:11:21', 2.00),
(7, 2, NULL, '2025-10-18 09:14:40', 2.00),
(8, 2, NULL, '2025-10-18 09:21:23', 2.00),
(9, 2, NULL, '2025-10-18 09:22:02', 135.80),
(10, 2, NULL, '2025-10-18 16:49:02', 6.80),
(11, 2, NULL, '2025-10-18 17:52:52', 14.00),
(12, 2, NULL, '2025-10-18 17:53:34', 50.00),
(13, 2, NULL, '2025-10-19 07:01:39', 3.80),
(14, 2, NULL, '2025-10-19 07:07:37', 2.00),
(15, 2, NULL, '2025-10-19 07:09:22', 3.80),
(16, 2, NULL, '2025-10-19 07:15:55', 11.80),
(17, 2, NULL, '2025-10-19 07:17:48', 13.10),
(18, 2, NULL, '2025-10-19 07:19:02', 2.00),
(19, 2, NULL, '2025-10-19 07:21:35', 4.00),
(20, 2, 1, '2025-10-19 07:24:36', 7.30),
(21, 2, NULL, '2025-10-19 07:27:02', 7.30),
(22, 2, 2, '2025-10-19 07:27:19', 9.50),
(23, 2, 3, '2025-10-19 08:24:51', 10.00),
(24, 2, NULL, '2025-10-20 06:09:55', 18.00),
(25, 2, NULL, '2025-10-20 06:34:43', 2.00),
(26, 2, NULL, '2025-10-20 07:37:31', 3.50),
(27, 2, 1, '2025-10-20 08:25:12', 5.00),
(28, 2, NULL, '2025-10-20 16:46:22', 2.00),
(29, 2, NULL, '2025-10-20 16:55:25', 7.30),
(30, 2, NULL, '2025-10-20 17:00:44', 5.00),
(31, 2, NULL, '2025-10-20 20:10:44', 3.50),
(32, 2, NULL, '2025-10-21 02:59:54', 4.50),
(33, 2, NULL, '2025-10-21 03:03:13', 4.50),
(34, 2, NULL, '2025-10-21 03:13:29', 3.80),
(35, 2, 1, '2025-10-21 03:59:50', 7.50),
(36, 2, NULL, '2025-10-21 04:20:57', 3.50),
(37, 2, NULL, '2025-10-21 04:33:46', 1080.00),
(38, 2, NULL, '2025-10-21 05:01:06', 4.50),
(39, 2, NULL, '2025-10-21 05:05:19', 3.80),
(40, 2, NULL, '2025-10-21 05:09:04', 6.90),
(41, 2, NULL, '2025-10-21 05:09:49', 2.00),
(42, 2, NULL, '2025-10-21 05:11:46', 2.00),
(43, 2, NULL, '2025-10-21 05:19:15', 3.50),
(44, 2, NULL, '2025-10-21 05:20:17', 6.90),
(45, 2, NULL, '2025-10-21 05:23:01', 2.00),
(46, 3, NULL, '2025-10-21 06:02:43', 2.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_barra` (`codigo_barra`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
