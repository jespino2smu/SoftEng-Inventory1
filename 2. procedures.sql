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
	IN StaffID INT,
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
    
    CALL AuditLog(StaffID, 'Staff', TableID, CONCAT(
		'Staff created: {Username: "', Username, '", FirstName: "', FirstName, '", MiddleInitial: "', MiddleInitial, '", LastName: "', LastName, '}')
    );
END //
DELIMITER ;

/* =================================================== */

DELIMITER //
CREATE PROCEDURE GetProductList()
BEGIN
	SELECT *
    FROM product;
    
    CALL AuditLog(StaffID, 'Product', TableID, 'Read all items from product')
    );
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

CALL SearchProductByName('Car');

/* ===================================================
DEFAULT VALUES:
*/

INSERT INTO staff (Username, Role, Password)
VALUES ('Superadmin', 'Manager', 'AAAAAAAA');

UPDATE staff
SET StaffId = 0
WHERE Username = 'Superadmin';


INSERT INTO usage_category (UsageId, Name)
VALUES (1, 'Ingredient');

-- Test Products
CALL AddProduct(0, 1, 'Caramel Syrup', 10);
CALL AddProduct(0, 1, 'Vanilla Syrup', 15);