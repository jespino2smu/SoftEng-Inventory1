USE soft_engr_inventory_management;

/* =================================================== */

/*
DELIMITER //
CREATE PROCEDURE CheckStockDiscrepancies()
BEGIN
	SELECT ProductId, ProductName, Inventory, StockIn, StockOut, StockIn - StockOut AS StockBalance,
		IF(StockIn - StockOut >= 0, False, True) AS BalanceDiscrepancy,
		IF(StockIn - StockOut = Inventory, False, True) AS CountDiscrepancy
	FROM product;
END //
DELIMITER ;

CALL CheckStockDiscrepancies();
*/

/* =================================================== */


DELIMITER //
CREATE FUNCTION BalanceDiscrepancy(StockIn DECIMAL(10, 0), StockOut DECIMAL(10, 0))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
	RETURN IF(StockIn - StockOut >= 0, False, True);
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION CountDiscrepancy(StockIn DECIMAL(10, 0), StockOut DECIMAL(10, 0), Inventory DECIMAL(10, 0))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
	RETURN IF(StockIn - StockOut = Inventory, False, True);
END //
DELIMITER ;

SELECT CountDiscrepancy(2, 3, 2);

/* =================================================== */

DELIMITER //
CREATE PROCEDURE CheckStockDiscrepancies(IN in_activityID INT)
BEGIN
	SELECT P.ProductId, P.ProductName, P.Inventory, P.StockIn, P.StockOut, P.StockIn - P.StockOut AS StockBalance,
		BalanceDiscrepancy(P.StockIn, P.StockOut) AS BalanceDiscrepancy,
		CountDiscrepancy(P.StockIn, P.StockOut, P.Inventory) AS CountDiscrepancy
	FROM product AS P
    RIGHT JOIN handled_stock AS S
    ON P.ProductId = S.ProductId
    WHERE S.ActivityId = in_activityID;
END //
DELIMITER ;

CALL CheckStockDiscrepancies(28);

/* =================================================== */

DELIMITER //
CREATE PROCEDURE ValidateStockDiscrepancies(IN in_activityID INT)
BEGIN
    IF (
	SELECT
		SUM(BalanceDiscrepancy(P.StockIn, P.StockOut)) +
        SUM(CountDiscrepancy(P.StockIn, P.StockOut, P.Inventory))
        > 0
	FROM product AS P
    RIGHT JOIN handled_stock AS S
    ON P.ProductId = S.ProductId
    WHERE S.ActivityId = in_activityID > 0) THEN
		UPDATE stock_activity
        SET HasDiscrepancy = TRUE
        WHERE ActivityId = in_activityID;
	END IF;
END //
DELIMITER ;

-- CALL ValidateStockDiscrepancies(29);

/* =================================================== */

DELIMITER //
CREATE PROCEDURE CheckAllStockDiscrepancies()
BEGIN
	SELECT ProductId, ProductName, Inventory, StockIn, StockOut, StockIn - StockOut AS StockBalance,
		BalanceDiscrepancy(StockIn, StockOut) AS BalanceDiscrepancy,
		CountDiscrepancy(StockIn, StockOut, Inventory) AS CountDiscrepancy
	FROM product AS P
    WHERE BalanceDiscrepancy(StockIn, StockOut) > 1 OR CountDiscrepancy(StockIn, StockOut, Inventory) > 0;
END //
DELIMITER ;

-- CALL CheckAllStockDiscrepancies();

DELIMITER //
CREATE PROCEDURE GetStockAllValues()
BEGIN
	SELECT ProductId, ProductName, Inventory, StockIn, StockOut, ModerateDepletionThreshold, CriticalDepletionThreshold
	FROM product;
END //
DELIMITER ;

CALL GetStockAllValues();

DELIMITER //
CREATE PROCEDURE GetStockValuesByActivityId(IN in_activityID INT)
BEGIN
	SELECT P.ProductId, ProductName, Inventory, StockIn, StockOut, ModerateDepletionThreshold, CriticalDepletionThreshold
	FROM product AS P
    RIGHT JOIN handled_stock AS S
    ON P.ProductId = S.ProductId
    WHERE S.ActivityId = in_activityID;
END //
DELIMITER ;

CALL GetStockValuesByActivityId(27);

/*
DELIMITER //
CREATE PROCEDURE GetStockIssues()
BEGIN
	SELECT ProductId, ProductName, Inventory, StockIn, StockOut, StockIn - StockOut AS StockBalance,
		BalanceDiscrepancy(StockIn, StockOut) AS BalanceDiscrepancy,
		CountDiscrepancy(StockIn, StockOut, Inventory) AS CountDiscrepancy
	FROM product AS P
    WHERE
		StockIn - StockOut <= ModerateDepletionThreshold OR
        StockIn - StockOut <= CriticalDepletionThreshold OR
		BalanceDiscrepancy(StockIn, StockOut) > 1 OR
        CountDiscrepancy(StockIn, StockOut, Inventory) > 0;
END //
DELIMITER ;

-- CALL GetStockIssues();

*/

/* =================================================== */
DELIMITER //
CREATE PROCEDURE GetProductsWithQuantity()
BEGIN
	SELECT ProductId, ProductName, Inventory, StockIn, StockOut, StockIn - StockOut AS StockBalance, ModerateDepletionThreshold, CriticalDepletionThreshold
	FROM product
    ORDER BY ProductName;
END //
DELIMITER ;

CALL GetProductsWithQuantity();

/* =================================================== */

DELIMITER //
CREATE PROCEDURE CheckStockDiscrepancies(IN in_activityID INT)
BEGIN
	SELECT P.ProductId, P.ProductName, P.Inventory, P.StockIn, P.StockOut, P.StockIn - P.StockOut AS StockBalance,
		IF(P.StockIn - P.StockOut >= 0, False, True) AS BalanceDiscrepancy,
		IF(P.StockIn - P.StockOut = Inventory, False, True) AS CountDiscrepancy
	FROM product AS P
    RIGHT JOIN handled_stock AS S
    ON P.ProductId = S.ProductId
    WHERE S.ActivityId = in_activityID;
END //
DELIMITER ;