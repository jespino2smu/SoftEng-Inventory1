exports.pool = null;

exports.getProducts = async (req, res) => {
    console.log("Ran!");
    const { userId } = req.body;

    try {

        const [result] = await exports.pool.execute(
            "CALL GetEmptyProducts()"
        );

    console.log(result);

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

    if (!activity) {
        return res.status(400).json({ message: "Incomplete user information" });
    }

    try {

        const [result] = await exports.pool.execute(
            "CALL CreateActivity(?, ?);",
            [userId, activity]
        );

        const activityId = result[0][0].id;
    console.log("activityId: " + activityId);

        res.status(200).json(result);
        // res.status(201).json({ message: "Success!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};