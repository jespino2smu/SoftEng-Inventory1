exports.pool = null;

exports.getProducts = async (req, res) => {
    //console.log("Ran!");
    const { userId } = req.body;

    try {

        const [result] = await exports.pool.execute(
            "CALL GetEmptyProducts()"
        );

        // console.log("\n");
        // console.log(result);

        //res.status(201).json({ message: "Success!" });
        res.status(201).json(result);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};

exports.addActivity = async (req, res) => {
    console.log("Add Activity");
    const { movement, stocks } = req.body;

    // console.log("activity: " + activity);
    // console.log("userId: " + req.userId);

    if (!movement) {
        return res.status(400).json({ message: "Stock movement is undefined" });
    }
    if (!stocks) {
        return res.status(400).json({ message: "Stocks are undefined" });
    }

    try {

        const [result] = await exports.pool.execute(
            "CALL CreateActivity(?, ?);",
            [req.userId, movement]
        );

        const activityId = result[0][0].id; // 
        console.log("userId: " + req.userId);
        console.log("activityId: " + activityId);

        let [stockInfo] = [];

        stocks.forEach(async (stock, index) => {
            console.log(`\tIndex ${index}:\n\tName: ${stock.ProductId}\n\tQuantity ${stock.Quantity}\n`);
            [stockInfo] = await exports.pool.execute(
                "CALL AddHandledStock(?, ?, ?);",
                [activityId, stock.ProductId, stock.Quantity]
            );
        });
        
        [stockInfo] = await exports.pool.execute(
            "CALL AddHandledStaff(?, ?);",
            [req.userId, activityId]
        );

        res.status(200).json(result);
        // res.status(201).json({ message: "Success!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};

exports.getStockActivities = async (req, res) => {
    // console.log("\n")
    // console.log("\n")
    // console.log("\n")
    // console.log("Activities!");
    // console.log("\n")
    //const { userId } = req.body;

    // console.log("activity: " + activity);
    // console.log("userID: " + req.userId);

    if (!req.userId) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {

        const [minMax] = await exports.pool.execute(
            "CALL GetMinMaxStockActivitiesId()",
            [req.userId]
        );
        
        // console.log("result:\n" + minMax[0][0].min + ", " +  + minMax[0][0].max);



        const [stockActivities] = await exports.pool.execute(
            "CALL GetStockActivities()"
        );

        // console.log("// ------------------------------------");
        // console.log("CALL GetStockActivities()");
        // for (let r = 0; r < stockActivities[0].length; r++) {
        //     console.log(stockActivities[0][r].ActivityId)
        // }

        const [handledStockProducts] = await exports.pool.execute(
            "CALL GetHandledStocks(?)", [req.userId]
        );
        
        const [handlingStaff] = await exports.pool.execute(
            "CALL GetHandlingStaff()",
        );

        //console.log("length: " + handlingStaff[0].length)
        let staffSummary = [];
        let currentStaff = [];

        let currentActivityId = minMax[0][0].max;
        let staffIndex = 0;

        for (let i = 0; i < handlingStaff[0].length; i++) {
            while (handlingStaff[0][i].ActivityId < currentActivityId) {
                if (currentActivityId == minMax[0][0].min) {
                    break;
                }
                staffSummary.push(currentStaff);

                currentActivityId--;
                staffIndex++;
                currentStaff = [];
            }
            
            currentStaff.push(handlingStaff[0][i].Staff)

            // include last set of items
            if (i === handlingStaff[0].length - 1) {
                staffSummary.push(currentStaff);
            }
        }

        // for (let i = 0; i < staffSummary.length; i++) {
        //     console.log(staffSummary[i]);
        // }


        let stockActivitySummary = [];
        let currentProduct = [];

        currentActivityId = minMax[0][0].max;
        let stockActivityIndex = 0;

        for (let i = 0; i < handledStockProducts[0].length; i++) {
            while (handledStockProducts[0][i].ActivityId < currentActivityId) {
                if (currentActivityId == minMax[0][0].min) {
                    break;
                }

                stockActivitySummary.push({
                    ActivityId: stockActivities[0][stockActivityIndex].ActivityId,
                    ActivityType: stockActivities[0][stockActivityIndex].ActivityType,
                    Date: stockActivities[0][stockActivityIndex].Date,
                    Staff: staffSummary[stockActivityIndex],
                    Products: currentProduct
                });
                currentActivityId--;
                stockActivityIndex++;
                currentProduct = [];
            }

            currentProduct.push({
                ProductName: handledStockProducts[0][i].ProductName,
                Quantity: handledStockProducts[0][i].Quantity
            })
            
                qqqq = false;

            // include last set of items
            if (i === handledStockProducts[0].length - 1) {
                stockActivitySummary.push({
                    ActivityId: stockActivities[0][stockActivityIndex].ActivityId,
                    ActivityType: stockActivities[0][stockActivityIndex].ActivityType,
                    Date: stockActivities[0][stockActivityIndex].Date,
                    Staff: staffSummary[stockActivityIndex],
                    Products: currentProduct
                });
            }
        }

        for (let i = 0; i < stockActivitySummary.length; i++) {
            console.log(stockActivitySummary[i])
        }

        res.status(200).json(stockActivitySummary);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};