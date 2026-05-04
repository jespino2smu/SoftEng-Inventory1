USE soft_engr_inventory_management;

/* =================================================== */

DELIMITER //
CREATE PROCEDURE AuditLog(
IN StaffID INT,
IN TableName VARCHAR(255),
IN RecordId int,
IN LogDescription LONGTEXT)
BEGIN
	INSERT INTO audit_log(StaffID, TableName, RecordId, LogDescription)
	VALUES (StaffID, TableName, RecordId, LogDescription);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE AuditLogIp(
IN StaffID INT,
IN TableName VARCHAR(255),
IN RecordId int,
IN Ip VARCHAR(100),
IN LogDescription LONGTEXT)
BEGIN
	INSERT INTO audit_log(StaffID, TableName, RecordId, Ip, LogDescription)
	VALUES (StaffID, TableName, RecordId, Ip, LogDescription);
END //
DELIMITER ;

/* =================================================== */

DELIMITER //
CREATE PROCEDURE CheckStaff(IN Ip VARCHAR(100), IN Username_in VARCHAR(50), IN FirstName_in VARCHAR(50), IN LastName_in VARCHAR(50))
BEGIN
	SELECT
		SUM(IF(Username=Username_in, 1, 0)) AS 'duplicateUsername',
		SUM(IF(FirstName=FirstName_in AND LastName=LastName_in, 1, 0)) AS 'duplicateName'
	FROM staff;
    CALL AuditLogIp(NULL, "staff", -1, Ip, CONCAT("Login attempt with Username='", Username_in, "'"));
END //
DELIMITER ;
/* =================================================== */

DELIMITER //
CREATE PROCEDURE GetStaffPasswordByUsername(IN Username VARCHAR(50))
BEGIN
   SELECT Password
   FROM Staff AS S
   WHERE S.Username = Username;
END //
DELIMITER ;

/* =================================================== */

DELIMITER //
CREATE FUNCTION CountStaffByUsername(Username VARCHAR(50)) RETURNS INT
   SELECT COUNT(Username)
   FROM Staff AS S
   WHERE S.Username = Username;
DELIMITER ;

/* =================================================== */

DELIMITER $$
CREATE FUNCTION CountStaffByUsername (Username VARCHAR(50)) RETURNS INT DETERMINISTIC
BEGIN
   DECLARE count INT;
   
   SELECT COUNT(Username)
   INTO count
   FROM Staff AS S
   WHERE S.Username = Username;
   RETURN count;
END$$
DELIMITER ;

/* =================================================== */
-- Untested:

DELIMITER //
CREATE PROCEDURE CreateStaff(
	IN Username VARCHAR(50), IN Password LONGTEXT,
    IN FirstName VARCHAR(50), IN MiddleInitial VARCHAR(50),
    IN LastName VARCHAR(50)
)
BEGIN
    DECLARE TableID INT;
    
	INSERT INTO Staff (Username, Password, FirstName, MiddleInitial, LastName)
    VALUES (Username, Password, FirstName, MiddleInitial, LastName);
    
    SELECT LAST_INSERT_ID()
    INTO TableID;
    
    CALL AuditLog(TableID, 'Staff', TableID, CONCAT(
		'Staff created: {Username: "', Username, '", FirstName: "', FirstName, '", MiddleInitial: "', MiddleInitial, '", LastName: "', LastName, '}')
    );
END //
DELIMITER ;

/* =================================================== */

DELIMITER //
CREATE PROCEDURE GetProductList()
BEGIN
	SELECT * FROM product;
    
    CALL AuditLog(StaffID, 'Product', TableID, 'Read all items from product');
END //
DELIMITER ;

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
CREATE PROCEDURE SearchProductByName(IN ProductName VARCHAR(100))
BEGIN
	SELECT *
    FROM product AS P
    WHERE P.ProductName LIKE CONCAT(ProductName, '%');
END //
DELIMITER ;

-- CALL SearchProductByName('Car');

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
	DECLARE ActivityId_ToAdd INT;
	DECLARE ProductId_ToAdd INT;
    DECLARE ActivityType_ToAdd ENUM('Receive', 'Dispatch', 'Inventory');
    
    SET ActivityId_ToAdd = ActivityId;
    SET ProductId_ToAdd = ProductId;
    
	INSERT INTO handled_stock (ActivityId, ProductId, Quantity)
    VALUES (ActivityId, ProductId, Quantity);
    
	SELECT A.ActivityType
    INTO ActivityType_ToAdd
	FROM stock_activity AS A
	WHERE A.ActivityId = ActivityId_ToAdd
    LIMIT 1;
    
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

DELIMITER //
CREATE PROCEDURE GetMinMaxStockActivitiesId()
BEGIN
	SELECT MIN(ActivityId) AS min, MAX(ActivityId) AS max
	FROM handled_stock
	LIMIT 1;
END //
DELIMITER ;

CALL GetMinMaxStockActivitiesId();
/* ================ */
DELIMITER //
CREATE PROCEDURE GetStockActivities()
BEGIN
	SELECT ActivityId, ActivityType, Date FROM stock_activity
    ORDER BY ActivityId DESC;
END //
DELIMITER ;

-- CALL GetStockActivities();

/* ================ */

DELIMITER //
CREATE PROCEDURE GetHandlingStaff()
BEGIN
	SELECT H.ActivityId, H.StaffId, CONCAT(U.LastName, ', ', U.FirstName) AS Staff
	FROM handling_staff AS H
	LEFT JOIN staff AS U
	ON H.StaffId = U.StaffId
    ORDER BY H.ActivityId DESC;
END //
DELIMITER ;

-- CALL GetHandlingStaff();

/* ================ */

DELIMITER //
CREATE PROCEDURE GetHandledStocks(IN UserId INT)
BEGIN
	SELECT S.ActivityId, S.ProductId, P.ProductName, S.Quantity, C.Name AS category
	FROM handled_stock AS S
	LEFT JOIN product AS P
		ON S.ProductId = P.ProductId
	LEFT JOIN usage_category AS C
	ON C.UsageId = P.UsageId
    ORDER BY S.ActivityId DESC
    LIMIT 10;
    
    CALL AuditLog(UserId, 'Handled_Stock', -1, 'Viewed handled stocks}');
END //
DELIMITER ;

-- CALL GetHandledStocks(1);

/* ================ */

DELIMITER //
CREATE PROCEDURE Login(IN Ip VARCHAR(100), IN input_username VARCHAR(100))
BEGIN
	DECLARE staff_id INT;
    IF EXISTS (SELECT 1 FROM staff WHERE username = input_username) THEN
    
		SELECT StaffId
        INTO staff_id
        FROM staff
        WHERE username = input_username;
        
        SELECT StaffId AS Id, Username, Password, FirstName, LastName, MiddleInitial, Role
        FROM staff 
        WHERE username = input_username;
        
        CALL AuditLogIp
        (
			staff_id, "staff", staff_id, Ip,
			CONCAT("Login (Username='", input_username, "').")
		);
    ELSE
        SELECT true AS NotFound;
        
        CALL AuditLogIp(NULL, "staff", -1, Ip, "Login failed with non-existent user.");
    END IF;
END //
DELIMITER ;
/* ===================================================

-- ===================================================

DELIMITER //
CREATE PROCEDURE CheckStockDiscrepancies()
BEGIN
	SELECT ProductId, ProductName, Inventory, StockIn, StockOut, StockIn - StockOut AS StockBalance,
		IF(StockIn - StockOut >= 0, False, True) AS BalanceDiscrepancy,
		IF(StockIn - StockOut = Inventory, False, True) AS CountDiscrepancy
	FROM product;
END //
DELIMITER ;

-- CALL CheckStockDiscrepancies();

/* ===================================================
DEFAULT VALUES:
*/

INSERT INTO staff (Username, Role, Password)
VALUES ('Superadmin', 'Manager', 'AAAAAAAA');

UPDATE staff
SET StaffId = 0
WHERE Username = 'Superadmin';

INSERT INTO staff (StaffId, Username, FirstName, MiddleInitial, LastName, Password)
VALUES (1, 'rob', 'Roberto', 'T', 'Bienestar', 'Roberto');

CALL CreateStaff ('tess', 'tess', 'Teresita', 'C', 'Tarantino');
CALL CreateStaff ('mateo', 'mateo', 'Mateo', 'A', 'Madriaga');
CALL CreateStaff ('esme', 'esme', 'Esmeralda', 'S', 'Buenavista');

/* ================ */


INSERT INTO usage_category (UsageId, Name)
VALUES (1, 'Ingredient');

-- Test Products
CALL AddProduct(0, 1, 'Caramel Syrup', 10);
CALL AddProduct(0, 1, 'Vanilla Syrup', 15);
CALL AddProduct(0, 1, 'Mocha Syrup', 15);
CALL AddProduct(0, 1, 'Coffee Syrup', 15);
CALL AddProduct(0, 1, 'Hazelnut Syrup', 15);
CALL AddProduct(0, 1, 'Salted Caramel Syrup', 15);
CALL AddProduct(0, 1, 'Buttery Caramel Syrup', 15);
CALL AddProduct(0, 1, 'Pumpkin Pie Syrup', 15);
CALL AddProduct(0, 1, 'Forest Pine Syrup', 15);
CALL AddProduct(0, 1, 'Cookie Butter Syrup', 15);
CALL AddProduct(0, 1, 'Irish Cream Syrup', 15);
CALL AddProduct(0, 1, 'Puremade Strawberry Syrup', 15);
CALL AddProduct(0, 1, 'Dark Chocolate Syrup', 15);