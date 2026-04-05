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