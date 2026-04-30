const bcrypt = require('bcryptjs');
const { generateToken } = require('../tokens');

const saltRounds = 10;
exports.pool = null;

exports.staffExists = async (req, res) => {
    const { username, firstName, lastName } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        // const [rows] = await exports.pool.execute(`
        //     SELECT
        //         SUM(IF(Username=?, 1, 0)) AS 'duplicateUsername',
        //         SUM(IF(FirstName=? AND LastName=?, 1, 0)) AS 'duplicateName'
        //     FROM staff;`, [username, firstName, lastName]
        // );
        const [rows] = await exports.pool.execute(`CALL CheckStaff(?, ?, ?)`, [username, firstName, lastName]
        );


        // if (rows[0].length === 0) {
        //     return res.status(404).json({ message: "Username not found" });
        // }

        if (rows[0].duplicateUsername > 0 && rows[0].duplicateName > 0) {
            return res.status(200).json({ exists: true, type: "both" });
        } else if (rows[0].duplicateUsername > 0) {
            return res.status(200).json({ exists: true, type: "username" });
        } else if (rows[0].duplicateName > 0) {
            return res.status(200).json({ exists: true, type: "name" });
        }

        console.log("\n");
        console.log(rows[0]);
        console.log("\n");
        res.status(200).json({ exists: false });

        // const selectedPassword = rows[0].Password;
        // const isMatch = await bcrypt.compare(password, selectedPassword);

        // if (!isMatch) {
        //     return res.status(401).json({ message: "Invalid username or password" });
        // } else {
        //   const token = generateToken(rows[0].Id, rows[0].Role);
        //   res.status(200).json({ token });
        // }

        
        //console.log("Status code Q: " +res.statusCode);
        // console.log(rows[0].Role);

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        //const [rows] = await exports.pool.execute('SELECT StaffId as Id, Username, Password, FirstName, LastName, MiddleInitial, Role FROM staff WHERE username=?', [username]);

        const [rows] = await exports.pool.execute('CALL Login(?)', [username]);


        if (!rows[0].length) {
            return res.status(500).json({ status: "invalid" });
        }
        console.log("Length: " + rows[0].length);


        if (rows[0][0].NotFound === 1) {
            return res.status(200).json({ status: "userNotFound", message: "Invalid username or password" });
        }

        // if (rows.length === 0) {
        //     //console.log("No user found with username: " + username);
        //     return res.status(200).json({ status: "false", message: "Invalid username or password" });
        // }
        //console.log(rows[0].Password);

        const selectedPassword = rows[0][0].Password;
        const isMatch = await bcrypt.compare(password, selectedPassword);

        console.log(isMatch);
        console.log(rows[0][0].Password);
        if (!isMatch) {
            console.log("Mismatch!");
            return res.status(200).json({ status: "invalidCredentials", message: "Invalid username or password" });
        } else {
            console.log("Matched!");
          const token = generateToken(rows[0].Id, rows[0].Role);
          res.status(200).json({ status: "success", token });
        }

        
        //console.log("Status code Q: " +res.statusCode);
        // console.log(rows[0].Role);

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
};

exports.signUp = async (req, res) => {
    const { username, password, firstName, lastName, middleInital } = req.body;


    if (!username || !password ||!firstName || !lastName) {
        return res.status(400).json({ message: "Incomplete user information" });
    }
    
    if (!middleInital) {
        middleInital = "";
    }

    const simplifiedName = username.trim().toLowerCase();

    try {
        let [matchedUserCount] = await exports.pool.execute(
            'SELECT COUNT(Username) as count FROM staff WHERE Username=?',
            [username.trim()]
        );

        //console.log(`\nMatched user[0]: ${matchedUserCount[0].count}\n`)
        if (matchedUserCount[0].count > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // [matchedUserCount] = await exports.pool.execute(
        //     'SELECT COUNT(fullname) FROM users_tbl WHERE fullname=?',
        //     [simplifiedName]
        // );
        // if (matchedUserCount[0].value > 0) {
        //     return res.status(400).json({ message: "Name already exists" });
        // }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await exports.pool.execute(
            'INSERT INTO staff (Username, Password, FirstName, LastName, MiddleInitial) VALUES (?, ?, ?, ?, ?);',
            [username.trim(), hashedPassword, firstName, lastName, middleInital]
        );

        res.status(201).json({ message: "User was signed up successfully!" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Error signing up user", details: error.message });
    }
};