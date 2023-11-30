const bcrypt = require("bcrypt");
const db = require("../models/db");

const register = async (req, res) => {
    const { username, password, name } = req.body;

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user's registration data into the "users" table
    const stmt = db.prepare(
        "INSERT INTO users (username, password, name) VALUES (?, ?, ?)"
    );
    stmt.run(username, hashedPassword, name, (err) => {
        if (err) {
            return res.status(500).send("Registration failed.");
        }
        res.status(201).send("User registered successfully!");
    });
    stmt.finalize();
};

const login = async (req, res) => {
    const { username, password } = req.body;

    // Retrieve the user's data from the database based on the provided username
    db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, user) => {
            if (err) {
                return res.status(500).send("Login failed.");
            }

            if (!user) {
                return res.status(401).send("Invalid username or password.");
            }

            // Compare the hashed password with the provided password using bcrypt
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).send("Invalid username or password.");
            }

            // Set session variable to indicate authentication
            req.session.isAuthenticated = true;
            req.session.userId = user.id;
            console.log("login");
            res.status(200).send("Login successful!");
        }
    );
};

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.status(200).send("Logged out successfully!");
    });
};

module.exports = {
    register,
    login,
    logout,
};
