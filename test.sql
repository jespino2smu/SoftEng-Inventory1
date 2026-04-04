SELECT * FROM soft_engr_inventory_management.stock_activity;
USE soft_engr_inventory_management;

-- ('Receive', 'Dispatch', 'Inventory')

INSERT INTO stock_activity (ActivityType)
VALUES ('Receive');


    SELECT LAST_INSERT_ID()
    INTO ActivityID;

/* =================================================== */

DELIMITER //
CREATE PROCEDURE GetEmptyProducts()
BEGIN
	SELECT ProductId, ProductName AS Name, 0 AS Quantity from product;
END //
DELIMITER ;











/* =================================================== */

DELIMITER //
CREATE PROCEDURE CreateActivity
(
	IN StaffID INT,
	IN ActivityType ENUM('Receive', 'Dispatch', 'Inventory')
)
BEGIN
	INSERT INTO stock_activity (ActivityType)
	VALUES (ActivityType);
    
    SELECT LAST_INSERT_ID() AS id;
END //
DELIMITER ;
/* ================ */
DELIMITER //
CREATE PROCEDURE AddHandledStaff(
	IN StaffID INT, IN ActivityID INT
)
BEGIN
	INSERT INTO handling_staff (StaffID, ActivityId)
    VALUES (StaffID, ActivityId);
END //
DELIMITER ;
/* ================ */
DELIMITER //
CREATE PROCEDURE AddHandledStock(
	IN ActivityId INT, IN ProductId INT, IN Quantity DECIMAL(10,0)
)
BEGIN
	INSERT INTO handled_stock (ActivityId, ProductId, Quantity)
    VALUES (ActivityId, ProductId, Quantity);
END //
DELIMITER ;

/* =================================================== */

CALL CreateActivity('Receive');
