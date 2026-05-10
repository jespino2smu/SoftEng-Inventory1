USE soft_engr_inventory_management;

/* =================================================== */

DELIMITER //
CREATE PROCEDURE AddProduct
(
	IN StaffID INT,
	IN UsageId INT,
	IN ProductName VARCHAR(100),
    IN StockIn DECIMAL
)
BEGIN
	DECLARE id INT;

	INSERT INTO product
    (UsageId, ProductName, Inventory, StockIn, StockOut)
    VALUES
    (UsageId, ProductName, StockIn, 0, 0);
    
    SELECT LAST_INSERT_ID()
    INTO id;
    
    CALL AuditLog(StaffID, 'Product', id, CONCAT(
		'Product added: {ProductName: "', ProductName, '}')
    );
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

CALL AddHandledStock(27, 3, 5);

DELIMITER //
CREATE PROCEDURE AddHandledStock(
	IN ActivityId INT, IN ProductId INT, IN Quantity DECIMAL(10,0)
)
BEGIN
	DECLARE ActivityId_ToAdd INT;
	DECLARE ProductId_ToAdd INT;
    DECLARE ActivityType_ToAdd ENUM('Receive', 'Dispatch', 'Inventory');
    
    -- For setting value of Previous Quantity
    DECLARE PreviousQuantity_ToAdd DECIMAL(10, 0);
    -- end
    
    SET ActivityId_ToAdd = ActivityId;
    SET ProductId_ToAdd = ProductId;
    
	INSERT INTO handled_stock (ActivityId, ProductId, Quantity)
    VALUES (ActivityId, ProductId, Quantity);
    
	SELECT A.ActivityType
    INTO ActivityType_ToAdd
	FROM stock_activity AS A
	WHERE A.ActivityId = ActivityId_ToAdd
    LIMIT 1;
    
    -- Set value of Previous Quantity
    IF ActivityType_ToAdd = 'Receive' THEN
		SELECT P.StockIn INTO PreviousQuantity_ToAdd FROM product AS P WHERE P.ProductId = ProductId_ToAdd;
	ELSEIF ActivityType_ToAdd = 'Dispatch' THEN
		SELECT P.StockOut INTO PreviousQuantity_ToAdd FROM product AS P WHERE P.ProductId = ProductId_ToAdd;
	ELSEIF ActivityType_ToAdd = 'Inventory' THEN
		SELECT P.Inventory INTO PreviousQuantity_ToAdd FROM product AS P WHERE P.ProductId = ProductId_ToAdd;
    END IF;
    
    UPDATE handled_stock AS S
    SET S.PreviousValue = PreviousQuantity_ToAdd
    WHERE S.ActivityId = ActivityId_ToAdd AND S.ProductId = ProductId_ToAdd;
    -- end
    
	UPDATE product AS P
	SET
		P.StockIn = CASE 
			WHEN ActivityType_ToAdd = 'Receive' THEN P.StockIn + Quantity
			ELSE P.StockIn
		END,
		P.StockOut = CASE 
			WHEN ActivityType_ToAdd = 'Dispatch' THEN P.StockOut + Quantity
			ELSE P.StockOut
		END,
		P.Inventory = CASE 
			WHEN ActivityType_ToAdd = 'Inventory' THEN Quantity
			ELSE P.Inventory
		END
	WHERE P.ProductId = ProductId_ToAdd;
    -- SELECT ActivityId_ToAdd, ActivityType_ToAdd;
END //
DELIMITER ;

/* =================================================== */