SELECT * FROM soft_engr_inventory_management.stock_activity;
USE soft_engr_inventory_management;

-- ('Receive', 'Dispatch', 'Inventory')

INSERT INTO stock_activity (ActivityType)
VALUES ('Receive');


    SELECT LAST_INSERT_ID()
    INTO ActivityID;











