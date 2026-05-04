CREATE DATABASE soft_engr_inventory_management;
USE soft_engr_inventory_management;

CREATE TABLE `staff` (
  `StaffId` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(50) NOT NULL,
  `Role` ENUM('Staff','Manager') NOT NULL,
  `Password` LONGTEXT NOT NULL,
  `FirstName` VARCHAR(50) DEFAULT NULL,
  `MiddleInitial` VARCHAR(50) DEFAULT NULL,
  `LastName` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`StaffId`),
  UNIQUE KEY `StaffId` (`StaffId`),
  UNIQUE KEY `Username` (`Username`)
);
CREATE TABLE `stock_activity` (
  `ActivityId` INT NOT NULL AUTO_INCREMENT,
  `ActivityType` ENUM('Receive','Dispatch','Inventory') DEFAULT NULL,
  `Date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ActivityId`),
  UNIQUE KEY `ActivityId` (`ActivityId`)
);

CREATE TABLE `usage_category` (
  `UsageId` INT NOT NULL,
  `Name` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`UsageId`),
  UNIQUE KEY `UsageId` (`UsageId`)
);

CREATE TABLE `product` (
  ProductId INT NOT NULL AUTO_INCREMENT,
  UsageId INT DEFAULT NULL,
  ProductName VARCHAR(100) DEFAULT NULL,
  Inventory DECIMAL,
  StockIn DECIMAL,
  StockOut DECIMAL,
  
  PRIMARY KEY (`ProductId`),
  UNIQUE KEY `ProductId` (`ProductId`),
  KEY `UsageId` (`UsageId`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`UsageId`) REFERENCES `usage_category` (`UsageId`)
);

CREATE TABLE `handled_stock` (
  `ActivityId` INT NOT NULL,
  `ProductId` INT NOT NULL,
  `Quantity` DECIMAL(10,0) DEFAULT NULL,
  KEY `ActivityId` (`ActivityId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `handled_stock_ibfk_1` FOREIGN KEY (`ActivityId`) REFERENCES `stock_activity` (`ActivityId`),
  CONSTRAINT `handled_stock_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `product` (`ProductId`)
);

CREATE TABLE `handling_staff` (
  `StaffId` INT NOT NULL,
  `ActivityId` INT NOT NULL,
  KEY `StaffId` (`StaffId`),
  KEY `ActivityId` (`ActivityId`),
  CONSTRAINT `handling_staff_ibfk_1` FOREIGN KEY (`StaffId`) REFERENCES `staff` (`StaffId`),
  CONSTRAINT `handling_staff_ibfk_2` FOREIGN KEY (`ActivityId`) REFERENCES `stock_activity` (`ActivityId`)
);

CREATE TABLE audit_log (
  LogId INT NOT NULL AUTO_INCREMENT,
  StaffId INT DEFAULT NULL,
  TableName VARCHAR(255) NOT NULL,
  RecordId INT NOT NULL,
  Ip VARCHAR(100) DEFAULT NULL,
  LogDescription LONGTEXT NOT NULL,
  Timestamp timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (LogId),
  KEY StaffId (StaffId)
);