-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NULL,
    `apellido` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'cliente',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'pendiente',
    `total` DOUBLE NOT NULL,
    `metodoPago` VARCHAR(191) NOT NULL DEFAULT 'mercadopago',
    `clienteNombre` VARCHAR(191) NOT NULL,
    `clienteEmail` VARCHAR(191) NOT NULL,
    `clienteTelefono` VARCHAR(191) NULL,
    `direccion` VARCHAR(500) NULL,
    `ciudad` VARCHAR(191) NULL,
    `provincia` VARCHAR(191) NULL,
    `codigoPostal` VARCHAR(191) NULL,
    `notas` TEXT NULL,
    `mpPreferenceId` VARCHAR(191) NULL,
    `mpPaymentId` VARCHAR(191) NULL,
    `emailClienteEnviado` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pedido_codigo_key`(`codigo`),
    INDEX `Pedido_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PedidoItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `productoId` VARCHAR(191) NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `prenda` VARCHAR(191) NULL,
    `talle` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,
    `precio` DOUBLE NOT NULL,
    `logoUrl` TEXT NULL,

    INDEX `PedidoItem_pedidoId_idx`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoItem` ADD CONSTRAINT `PedidoItem_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
