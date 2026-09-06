-- CreateTable
CREATE TABLE `Ajuste` (
    `clave` VARCHAR(191) NOT NULL,
    `valor` LONGTEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`clave`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
