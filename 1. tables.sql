CREATE DATABASE soft_engr_inventory_management;
USE soft_engr_inventory_management;

CREATE TABLE `staff` (
  `StaffId` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Role` enum('Staff','Manager') NOT NULL,
  `Password` longtext NOT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `MiddleInitial` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`StaffId`),
  UNIQUE KEY `StaffId` (`StaffId`),
  UNIQUE KEY `Username` (`Username`)
);
CREATE TABLE `stock_activity` (
  `ActivityId` int NOT NULL AUTO_INCREMENT,
  `ActivityType` enum('Receive','Dispatch','Inventory') DEFAULT NULL,
  `Date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ActivityId`),
  UNIQUE KEY `ActivityId` (`ActivityId`)
);

CREATE TABLE `usage_category` (
  `UsageId` int NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
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
  `ActivityId` int NOT NULL,
  `ProductId` int NOT NULL,
  `Quantity` decimal(10,0) DEFAULT NULL,
  KEY `ActivityId` (`ActivityId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `handled_stock_ibfk_1` FOREIGN KEY (`ActivityId`) REFERENCES `stock_activity` (`ActivityId`),
  CONSTRAINT `handled_stock_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `product` (`ProductId`)
);

CREATE TABLE `handling_staff` (
  `StaffId` int NOT NULL,
  `ActivityId` int NOT NULL,
  KEY `StaffId` (`StaffId`),
  KEY `ActivityId` (`ActivityId`),
  CONSTRAINT `handling_staff_ibfk_1` FOREIGN KEY (`StaffId`) REFERENCES `staff` (`StaffId`),
  CONSTRAINT `handling_staff_ibfk_2` FOREIGN KEY (`ActivityId`) REFERENCES `stock_activity` (`ActivityId`)
);

CREATE TABLE `audit_log` (
  `LogId` int NOT NULL AUTO_INCREMENT,
  `StaffId` int DEFAULT NULL,
  `TableName` varchar(255) NOT NULL,
  `RecordId` int NOT NULL,
  `LogDescription` longtext NOT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogId`),
  KEY `StaffId` (`StaffId`),
  CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`StaffId`) REFERENCES `staff` (`StaffId`)
);
