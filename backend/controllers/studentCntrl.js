const pool = require("../config/db");

const createStudent = async (req,res) => { 
    try{
        const{ first_name, last_name, email, phone, gender, date_of_birth, address, city, state} = req.body;

        //input validations
        if(!first_name || !last_name || !email || !phone || !gender || !date_of_birth){
            return res.status(400).json({message: "first_name,last_name,email,phone,gender,dob fields are required."});
        }

        const emailEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailEx.test(email)){
            return res.status(400).json({message: "Invalid Email format"});
        }

        const phoneEx = /^[0-9]{10}$/;

        if(!phoneEx.test(phone)){
            return res.status(400).json({message: "Phone number must contain exactly 10 digits."});
        }
        
        const emailCheck = await pool.query("select * from students where email = $1", [email]);
        
        //check email already exists
        if(emailCheck.rows.length > 0){
            return res.status(400).json({message: "Email already exists"});
        }

        //check phone already exists
        const phoneCheck = await pool.query("select * from students where phone = $1", [phone]);

        if(phoneCheck.rows.length > 0){
            return res.status(400).json({message: "Phone No. already exists"});
        }

        //insert student record
        const result = await pool.query("insert into students(first_name, last_name, email, phone, gender, date_of_birth, address, city, state) values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *", 
        [first_name, last_name, email, phone, gender, date_of_birth, address, city, state]);

        res.status(201).json({message: "Student created successfully", student: result.rows[0]});

    } catch(error){
        res.status(500).json({message: error.message});
    }
};

// Get All Students with Pagination
const getAllStudents = async (req, res) => {
    try {
        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get total count
        const countResult = await pool.query("select count(*) from students");
        const totalRecords = parseInt(countResult.rows[0].count);

        // Get students with pagination
        const result = await pool.query("select * from students order by id limit $1 offset $2",[limit, offset]);

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


const getStudentById = async (req,res) => {
    try{
        const {id} = req.params;
        
        const studentResult = await pool.query("select * from students where id = $1",[id]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({message: "Student not found"});
        }

        // Get student marks
        const marksResult = await pool.query("select * from marks where student_id = $1",[id]);

        // Get student courses
        const coursesResult = await pool.query("select c.*, sc.assigned_date from courses c join student_courses sc on c.id = sc.course_id where sc.student_id = $1",[id]);
        res.json({student: studentResult.rows[0],marks: marksResult.rows,courses: coursesResult.rows});

    }catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateStudent = async (req,res) => {
    try{
        const {id} = req.params;
        const {first_name, last_name, email, phone, gender, date_of_birth, address, city, state} = req.body;

        const studentCheck = await pool.query("select * from students where id = $1", [id]);

        if(studentCheck.rows.length === 0){
            return res.status(404).json({message: "Student not found"});
        }

        const result = await pool.query("update students set first_name = $1, last_name = $2, email = $3, phone = $4,gender = $5, date_of_birth = $6, address = $7, city = $8, state = $9, updated_at = CURRENT_TIMESTAMP where id = $10 returning * ",[first_name, last_name, email, phone, gender, date_of_birth, address, city, state, id]);
        res.json({message: "Student updated successfully",student: result.rows[0]});

    } catch(error){
        res.status(500).json({message: error.message});
    }
};

const deleteStudent = async (req,res) => {
    try{

        const {id} = req.params;

        const studentCheck = await pool.query("select * from students where id = $1", [id]);

        if(studentCheck.rows.length === 0){
            return res.status(404).json({message: "Student Not Found"});
        }

        await pool.query("delete from students where id = $1",[id]);
        res.json({message: "student deleted successfully."});

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent};
