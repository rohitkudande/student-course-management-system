const pool = require("../config/db");

//assign course to student

const assignCourseToStudent = async (req,res) =>{
    try{
        const {student_id, course_id} = req.body;

        if(!student_id || !course_id){
            return res.status(400).json({message: "student_id,course_id is required"});
        }

        const studentCheck = await pool.query("select * from students where id = $1", [student_id]);

        if(studentCheck.rows.length === 0){
            return res.status(404).json({message: "student not found"});
        }

        const courseCheck = await pool.query("select * from courses where id = $1", [course_id]);

        if(courseCheck.rows.length === 0){
            return res.status(404).json({message: "course not found"});
        }

        const assignCheck = await pool.query("select * from student_courses where student_id = $1 and course_id = $2", [student_id, course_id]);

        if(assignCheck.rows.length > 0){
            return res.status(400).json({message: "course already assigned to student"});
        }

        const result = await pool.query("insert into student_courses(student_id, course_id) values($1,$2) returning *", [student_id, course_id]);
        res.status(201).json({message: "course assigned to student successfully..."});  

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// get all courses assigned to student

const getCoursesByStudentId = async (req,res) => {
    try{

        const {student_id} = req.params;

        const result = await pool.query("select c.*, sc.assigned_date from courses c join student_courses sc on c.id = sc.course_id where sc.student_id = $1", [student_id]);
        res.json({courses: result.rows});

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//delete course assigned to student

const deleteCourseFromStudent = async (req,res) => {
    try{
        const {student_id, course_id} = req.params;

        const result = await pool.query("delete from student_courses where student_id = $1 and course_id = $2 returning *", [student_id, course_id]);
        if(result.rows.length === 0){
            res.status(404).json({message: "course not assigned to student"});
        }else{
            res.json({message: "course removed from student successfully..."});
        }

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {assignCourseToStudent, getCoursesByStudentId, deleteCourseFromStudent};
