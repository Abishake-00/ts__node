-- CreateTable
CREATE TABLE `AttendanceData` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `type` ENUM('check_in', 'check_out') NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `attendanceType` VARCHAR(191) NOT NULL,
    `attendanceLocTypeId` BOOLEAN NOT NULL DEFAULT true,
    `isLeave` BOOLEAN NOT NULL DEFAULT false,

    INDEX `AttendanceData_date_idx`(`date`),
    UNIQUE INDEX `AttendanceData_date_type_key`(`date`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `userDeviceId` VARCHAR(191) NULL,
    `deviceType` VARCHAR(191) NULL,
    `officeLat` VARCHAR(191) NOT NULL,
    `officeLng` VARCHAR(191) NOT NULL,
    `homeLat` VARCHAR(191) NOT NULL,
    `homeLng` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_username_idx`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttendanceData` ADD CONSTRAINT `AttendanceData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
