/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `AttendanceData` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `AttendanceData_date_type_key` ON `AttendanceData`;

-- CreateIndex
CREATE INDEX `AttendanceData_type_idx` ON `AttendanceData`(`type`);

-- CreateIndex
CREATE INDEX `AttendanceData_attendanceLocTypeId_idx` ON `AttendanceData`(`attendanceLocTypeId`);

-- CreateIndex
CREATE UNIQUE INDEX `AttendanceData_type_key` ON `AttendanceData`(`type`);

-- CreateIndex
CREATE INDEX `User_name_idx` ON `User`(`name`);

-- RenameIndex
ALTER TABLE `AttendanceData` RENAME INDEX `AttendanceData_userId_fkey` TO `AttendanceData_userId_idx`;
