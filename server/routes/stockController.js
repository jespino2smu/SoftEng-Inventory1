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