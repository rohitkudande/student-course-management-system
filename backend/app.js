const express = require("express");
const pool = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentCourseRoutes = require("./routes/studentCourseRoutes");
const markRoutes = require("./routes/markRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student-courses", studentCourseRoutes);
app.use("/api/marks", markRoutes);


pool.connect()
    .then(() => console.log("Database Connected Successfully...!"))
    .catch(err => console.log("Database Connection Error:", err));


app.get("/",(req,res) => {
    res.send("Welcome to Student Management System...!");
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({message: "Route not found"});
});

// Error handling middleware

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Something went wrong!",error: err.message});
});


app.listen(3000, () => {
    console.log("Server Running on http://localhost:3000");
});