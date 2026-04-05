const bcrypt = require('bcrypt');

const saltRounds = 10;
exports.pool = null;


// exports.test = async (req, res) => {
//     console.log("Ran!");
//     const { userId, test } = req.body;

//     console.log("test: " + test);
//     console.log("userId: " + userId);
//     if (!test) {
//         return res.status(400).json({ message: "Incomplete user information" });
//     }

//     try {

//         const [result] = await exports.pool.execute(
//             "CALL AuditLog(?, 'Table', 2, ?);",
//             [userId, test]
//         );

//         res.status(201).json({ message: "Success!" });

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ message: "Error", details: error.message });
//     }
// };

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const [rows] = await exports.pool.execute('SELECT fullname AS name, email, role, password FROM users_tbl WHERE email=?', [email]);

        if (rows[0].length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const selectedPassword = rows[0].password;
        const isMatch = await bcrypt.compare(password, selectedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            name: rows[0].name,
            role: rows[0].role
        });
        
        //console.log("Status code Q: " +res.statusCode);
        console.log(rows[0].role);

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
};

exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Ran");
    console.log("Name: " + name);
    console.log("Email: " + email);
    console.log("Password: " + password);


    if (!name || !email || !password) {
        return res.status(400).json({ message: "Incomplete user information" });
    }
    const simplifiedName = name.trim().toLowerCase();

    try {
        let [matchedUserCount] = await exports.pool.execute(
            'SELECT COUNT(email) FROM users_tbl WHERE email=?',
            [email]
        );
        if (matchedUserCount[0].value > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        [matchedUserCount] = await exports.pool.execute(
            'SELECT COUNT(fullname) FROM users_tbl WHERE fullname=?',
            [simplifiedName]
        );
        if (matchedUserCount[0].value > 0) {
            return res.status(400).json({ message: "Name already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await exports.pool.execute(
            'INSERT INTO users_tbl (fullname, email, password) VALUES (?, ?, ?);',
            [name.trim(), email, hashedPassword]
        );

        res.status(201).json({ message: "User was signed up successfully!" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Error signing up user", details: error.message });
    }
};