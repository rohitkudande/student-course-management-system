const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Registration
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        //input validation        
        if(!username || !email || !password){
            return res.status(400).json({message: "Username, Email, Password required"});
        }

        const emailEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailEx.test(email)){
            return res.status(400).json({message: "Invalid email format"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }


        const userCheck = await pool.query("select * from users where email = $1",[email]);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({message: "User already exists with this email"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query("insert into users (username, email, password) values ($1, $2, $3) returning id, username, email, created_at", [username, email, hashedPassword]);

        res.status(201).json({message: "User registered successfully",user: result.rows[0]});

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await pool.query("select * from users where email = $1",[email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        const user = result.rows[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register, login };