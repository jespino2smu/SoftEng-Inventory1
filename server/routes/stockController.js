exports.pool = null;

exports.getProducts = async (req, res) => {
    //console.log("Ran!");
    const { userId } = req.body;

    try {

        const [result] = await exports.pool.execute(
            "CALL GetEmptyProducts()"
        );

        //console.log(result);

        res.status(200).json(result);
        // res.status(201).json({ message: "Success!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};

exports.addActivity = async (req, res) => {
    console.log("Ran!");
    const { userId, movement, stocks } = req.body;

    // console.log("activity: " + activity);
    // console.log("userId: " + userId);

    if (!movement) {
        return res.status(400).json({ message: "Stock movement is undefined" });
    }
    if (!stocks) {
        return res.status(400).json({ message: "Stocks are undefined" });
    }

    try {

        const [result] = await exports.pool.execute(
            "CALL CreateActivity(?, ?);",
            [userId, movement]
        );

        const activityId = result[0][0].id;
        console.log("userId: " + userId);
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
            [userId, activityId]
        );

        res.status(200).json(result);
        // res.status(201).json({ message: "Success!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};

exports.getStockActivities = async (req, res) => {
    console.log("Ran!");
    const { userId } = req.body;

    // console.log("activity: " + activity);
    // console.log("userId: " + userId);

    // if (!userId) {
    //     return res.status(400).json({ message: "User does not exist" });
    // }

    try {

        const [minMax] = await exports.pool.execute(
            "CALL GetMinMaxStockActivitiesId()",
            [userId]
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
            "CALL GetHandledStocks(?)", [userId]
        );

        // console.log("length: " + result[0].length);
        

        // console.log("// ------------------------------------");
        // for (i = minMax[0][0].min; i <= minMax[0][0].max; i++) {
        //     //console.log(i);
        // }

        let stockActivitySummary = [];
        let currentProduct = [];

        let minActivityId = minMax[0][0].min;
        let stockActivityIndex = 0;

        // console.log("// ------------------------------------");
        for (let Y = 0; Y < handledStockProducts[0].length; Y++) {
            while (handledStockProducts[0][Y].ActivityId != minActivityId) {
                stockActivitySummary.push({
                    ActivityId: stockActivities[0][stockActivityIndex].ActivityId,
                    ActivityType: stockActivities[0][stockActivityIndex].ActivityType,
                    Date: stockActivities[0][stockActivityIndex].Date,
                    Products: currentProduct
                });
                currentProduct = [];
                minActivityId++;
                stockActivityIndex++;
            }
            currentProduct.push({
                ProductName: handledStockProducts[0][Y].ProductName,
                Quantity: handledStockProducts[0][Y].Quantity,
            })

            // include last set of items
            if (Y === handledStockProducts[0].length - 1) {
                stockActivitySummary.push({
                    ActivityId: stockActivities[0][stockActivityIndex].ActivityId,
                    ActivityType: stockActivities[0][stockActivityIndex].ActivityType,
                    Date: stockActivities[0][stockActivityIndex].Date,
                    Products: currentProduct
                });
            }
        }


        // let toExport2 = JSON.stringify(stockActivitySummary);
        // console.log("JSON parse: " + JSON.parse(toExport2));

        for (let i = 0; i < stockActivitySummary.length; i++) {
            console.log(stockActivitySummary[i])
        }
        
        // for (j = 0; j < result[0].length; j++) {
        //     Object.keys(toExport).forEach(key0 => {
        //         console.log(`{`);
        //         Object.keys(toExport[key0]).forEach(key1 => {
        //             console.log(`  {`);
        //             Object.keys(toExport[key0][key1]).forEach(key2 => {
        //                 console.log(`    ${key2}: ${toExport[key0][key1][key2]}`);
        //             });
        //             console.log(`  }`);
        //         });
        //         console.log(`}`);
        //     });
        // }

        // console.log("// ------------------------------------");

        res.status(200).json(stockActivitySummary);
        // res.status(201).json({ message: "Success!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};
