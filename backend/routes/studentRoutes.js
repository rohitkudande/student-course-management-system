const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const studentCntrl = require("../controllers/studentCntrl");

// All routes require authentication
router.post("/", auth, studentCntrl.createStudent);

router.get("/", auth, studentCntrl.getAllStudents);

router.get("/:id", auth, studentCntrl.getStudentById);

router.put("/:id", auth, studentCntrl.updateStudent);

router.delete("/:id", auth, studentCntrl.deleteStudent);
// Get All Students with Pagination
const getAllStudents = async (req, res) => {
    try {
        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get total count
        const countResult = await pool.query("SELECT COUNT(*) FROM students");
        const totalRecords = parseInt(countResult.rows[0].count);

        // Get students with pagination
        const result = await pool.query(
            `SELECT * FROM students 
             ORDER BY id 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                currentPage: page,
                perPage: limit,
                totalRecords: totalRecords,
                totalPages: Math.ceil(totalRecords / limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = router;