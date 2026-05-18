
exports.pool = null;



exports.getStockDiscrepancies = async (req, res) => {

    if (!req.userId) {
        return res.status(400).json({ message: "User does not exist" });
    }

    try {
        const [stockActivities] = await exports.pool.execute(
            "CALL GetStockActivities()"
        );

        res.status(200).json(stockActivitySummary);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error", details: error.message });
    }
};