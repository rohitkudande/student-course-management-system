const pool = require("../config/db");

const createCourse = async (req,res) => {
    try{
        const {course_name, course_code, duration, fees, description} = req.body;

        if(!course_name || !course_code || !duration || !fees){
            return res.status(400).json({message: "course_name,course_code,duration,fees are required"});
        }

        if(fees <= 0){
            return res.status(400).json({message: "Fees must be greater than 0"});
        }


        const codeCheck = await pool.query("select * from courses where course_code = $1", [course_code]);

        if(codeCheck.rows.length > 0){
            return res.status(400).json({message: "course code already exists"});
        }

        // insert course record
        const result = await pool.query("insert into courses(course_name, course_code, duration, fees, description) values($1,$2,$3,$4,$5) returning *", [course_name, course_code, duration, fees, description]);
        res.status(201).json({message: "course creadted successfully.."});

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//get all courses

const getAllCourses = async (req,res) => {
    try{
        const result = await pool.query("select * from courses");
        res.json({courses: result.rows});

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// get course by id

const getCourseById = async (req,res) => {
    try{

        const {id} = req.params;

        const result = await pool.query("select * from courses where id = $1", [id]);

        if(result.rows.length === 0){
            return res.status(404).json({message: "course not found"});
        }

        res.json(result.rows[0]);

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// update course

const updateCourse = async (req,res) =>{
    try{
        const {id} = req.params;

        const {course_name, course_code, duration, fees, description} = req.body;

        const courseCheck = await pool.query("select * from courses where id = $1", [id]);

        if(courseCheck.rows.length === 0){
            return res.status(404).json({message: "course not found"});
        }

        const result = await pool.query("update courses set course_name = $1, course_code = $2, duration = $3, fees = $4, description = $5 where id = $6 returning *", [course_name,course_code,duration,fees,description,id]);
        res.json({message: "course updated successfully", course: result.rows[0]});
        
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// delete course

const deleteCourse = async (req,res) => {
    try{

        const {id} = req.params;

        const courseCheck = await pool.query("select * from courses where id = $1", [id]);

        if(courseCheck.rows.length === 0){
            return res.status(404).json({message: "course not found"});
        }

        const result = await pool.query("delete from courses where id = $1", [id]);
        res.status(200).json({message: "course deleted successfully.."});

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse};