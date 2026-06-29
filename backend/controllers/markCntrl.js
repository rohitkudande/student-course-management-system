const pool = require("../config/db");

// Add Marks for Student
const addMarks = async (req, res) => {
    try {
        const { student_id, subject, marks } = req.body;

        if(!student_id || !subject || marks === undefined || marks === null){
            return res.status(400).json({message: "student_id,subject,marks are required"});
        }

        if(marks < 0 || marks >100){
            return res.status(400).json({message: "Marks must be between 0 to 100"});
        }

        const studentCheck = await pool.query("select * from students where id = $1",[student_id]);

        if (studentCheck.rows.length === 0) {
            return res.status(404).json({message: "Student not found"});
        }

        // Insert marks
        const result = await pool.query("insert into marks (student_id, subject, marks) values ($1, $2, $3) returning *", [student_id, subject, marks]);
        res.status(201).json({message: "Marks added successfully",marks: result.rows[0]});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Get Marks by Student ID
const getStudentMarks = async (req, res) => {
    try {
        const { student_id } = req.params;

        const result = await pool.query("select * from marks where student_id = $1 order by id",[student_id]);
        res.json({marks: result.rows});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Update Marks
const updateMarks = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, marks } = req.body;

        if(!subject || marks === undefined || marks === null){
            return res.status(400).json({message: "subject and marks are required"});
        }

        if(marks < 0 || marks >100){
            return res.status(400).json({message: "Marks must be between 0 to 100"});
        }

        const result = await pool.query("update marks set subject = $1, marks = $2 where id = $3 returning *",[subject, marks, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }else{
            res.json({message: "Marks updated successfully",marks: result.rows[0]});
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Marks
const deleteMarks = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query("delete from marks where id = $1 returning *",[id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Marks record not found"
            });
        }else{
            res.json({message: "Marks deleted successfully"});
        }

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

module.exports = {
    addMarks,
    getStudentMarks,
    updateMarks,
    deleteMarks
};