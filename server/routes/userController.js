const bcrypt = require('bcryptjs');
const { generateToken } = require('../tokens');

const saltRounds = 10;
exports.pool = null;

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const [rows] = await exports.pool.execute('SELECT StaffId as Id, Username, Password, FirstName, LastName, MiddleInitial, Role FROM staff WHERE username=?', [username]);

        if (rows[0].length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const selectedPassword = rows[0].Password;
        const isMatch = await bcrypt.compare(password, selectedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        } else {
          const token = generateToken(rows[0].Id, rows[0].Role);
          res.status(200).json({ token });
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
            'SELECT COUNT(Username) FROM staff WHERE username=?',
            [username]
        );
        if (matchedUserCount[0].value > 0) {
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