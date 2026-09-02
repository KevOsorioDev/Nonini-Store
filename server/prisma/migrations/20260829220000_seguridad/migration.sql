ALTER TABLE `Archivo` ADD COLUMN `clave` VARCHAR(191) NULL;
UPDATE `Archivo` SET `clave` = CONCAT('a', id, UNIX_TIMESTAMP()) WHERE `clave` IS NULL;
ALTER TABLE `Archivo` MODIFY `clave` VARCHAR(191) NOT NULL;
CREATE UNIQUE INDEX `Archivo_clave_key` ON `Archivo`(`clave`);

ALTER TABLE `Pedido` ADD COLUMN `accesoToken` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `Pedido_accesoToken_key` ON `Pedido`(`accesoToken`);
